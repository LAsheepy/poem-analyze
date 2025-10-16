-- 创建诗词解析平台数据库表结构

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
    avatar_url TEXT,
    learning_progress INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    analyzed_poems INTEGER DEFAULT 0,
    average_score DECIMAL(3,2) DEFAULT 0,
    mastery_level VARCHAR(20) DEFAULT 'beginner',
    weekly_activity INTEGER DEFAULT 0,
    weekly_study_time INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    interests TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- 诗词表
CREATE TABLE IF NOT EXISTS poems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    dynasty VARCHAR(50) NOT NULL,
    content TEXT[] NOT NULL,
    translation TEXT,
    difficulty VARCHAR(10) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    tags TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 诗词解析表
CREATE TABLE IF NOT EXISTS poem_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    word_analysis JSONB,
    imagery_analysis JSONB,
    overall_analysis JSONB,
    author_info JSONB,
    historical_context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(poem_id, user_id)
);

-- 学习记录表
CREATE TABLE IF NOT EXISTS learning_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES poem_analyses(id) ON DELETE SET NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    time_spent INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI对话表
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES poems(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI消息表
CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(10) CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_poems_dynasty ON poems(dynasty);
CREATE INDEX IF NOT EXISTS idx_poems_difficulty ON poems(difficulty);
CREATE INDEX IF NOT EXISTS idx_poems_tags ON poems USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_poem_analyses_user ON poem_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_user ON learning_records(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id);

-- 创建函数：增加诗词浏览量
CREATE OR REPLACE FUNCTION increment_views(poem_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE poems SET views = views + 1 WHERE id = poem_id;
END;
$$ LANGUAGE plpgsql;

-- 创建函数：增加诗词点赞数
CREATE OR REPLACE FUNCTION increment_likes(poem_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE poems SET likes = likes + 1 WHERE id = poem_id;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器：自动更新updated_at字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要updated_at字段的表创建触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poems_updated_at BEFORE UPDATE ON poems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poem_analyses_updated_at BEFORE UPDATE ON poem_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户可以管理自己的数据
CREATE POLICY "用户只能查看和修改自己的数据" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "用户可以查看所有诗词" ON poems FOR SELECT USING (true);
CREATE POLICY "用户可以管理自己的解析" ON poem_analyses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "用户可以管理自己的学习记录" ON learning_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "用户可以管理自己的对话" ON ai_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "用户可以查看自己对话的消息" ON ai_messages FOR ALL USING (auth.uid() IN (SELECT user_id FROM ai_conversations WHERE id = conversation_id));

-- 插入示例数据
INSERT INTO poems (title, author, dynasty, content, difficulty, tags) VALUES
('静夜思', '李白', '唐代', ARRAY['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'], 'easy', ARRAY['思乡', '月亮', '夜晚']),
('春晓', '孟浩然', '唐代', ARRAY['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'], 'easy', ARRAY['春天', '自然', '早晨']),
('登鹳雀楼', '王之涣', '唐代', ARRAY['白日依山尽', '黄河入海流', '欲穷千里目', '更上一层楼'], 'medium', ARRAY['登高', '壮丽', '哲理']),
('江雪', '柳宗元', '唐代', ARRAY['千山鸟飞绝', '万径人踪灭', '孤舟蓑笠翁', '独钓寒江雪'], 'hard', ARRAY['冬天', '孤独', '自然']);

-- 创建默认用户（用于演示）
INSERT INTO users (id, username, email, role) VALUES
('00000000-0000-0000-0000-000000000001', 'demo_student', 'student@example.com', 'student'),
('00000000-0000-0000-0000-000000000002', 'demo_teacher', 'teacher@example.com', 'teacher');