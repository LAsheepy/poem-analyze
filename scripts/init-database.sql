-- 诗韵星数据库初始化脚本
-- 创建必要的表和函数

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
    avatar_url TEXT,
    learning_progress INTEGER DEFAULT 0 CHECK (learning_progress >= 0 AND learning_progress <= 100),
    streak_days INTEGER DEFAULT 0,
    analyzed_poems INTEGER DEFAULT 0,
    average_score INTEGER DEFAULT 0,
    mastery_level VARCHAR(20) DEFAULT '初级',
    weekly_activity INTEGER DEFAULT 0,
    weekly_study_time INTEGER DEFAULT 0,
    completion_rate INTEGER DEFAULT 0,
    interests TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- 诗词表
CREATE TABLE IF NOT EXISTS poems (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES poem_analyses(id) ON DELETE SET NULL,
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    time_spent INTEGER DEFAULT 0, -- 秒数
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI对话表
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES poems(id) ON DELETE SET NULL,
    title VARCHAR(200) DEFAULT '新对话',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI消息表
CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_poems_dynasty ON poems(dynasty);
CREATE INDEX IF NOT EXISTS idx_poems_difficulty ON poems(difficulty);
CREATE INDEX IF NOT EXISTS idx_poems_tags ON poems USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_poems_created ON poems(created_at);
CREATE INDEX IF NOT EXISTS idx_learning_records_user ON learning_records(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_created ON learning_records(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created ON ai_messages(created_at);

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要更新时间的表创建触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poems_updated_at BEFORE UPDATE ON poems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poem_analyses_updated_at BEFORE UPDATE ON poem_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建增加浏览量的函数
CREATE OR REPLACE FUNCTION increment_views(poem_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE poems SET views = views + 1 WHERE id = poem_id;
END;
$$ language 'plpgsql';

-- 创建增加点赞数的函数
CREATE OR REPLACE FUNCTION increment_likes(poem_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE poems SET likes = likes + 1 WHERE id = poem_id;
END;
$$ language 'plpgsql';

-- 插入示例诗词数据
INSERT INTO poems (title, author, dynasty, content, difficulty, tags) VALUES
('静夜思', '李白', '唐代', ARRAY['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。'], 'easy', ARRAY['思乡', '月亮', '夜晚']),
('春晓', '孟浩然', '唐代', ARRAY['春眠不觉晓，', '处处闻啼鸟。', '夜来风雨声，', '花落知多少。'], 'easy', ARRAY['春天', '自然', '清新']),
('登鹳雀楼', '王之涣', '唐代', ARRAY['白日依山尽，', '黄河入海流。', '欲穷千里目，', '更上一层楼。'], 'medium', ARRAY['登高', '哲理', '壮阔']),
('水调歌头·明月几时有', '苏轼', '宋代', ARRAY['明月几时有？把酒问青天。', '不知天上宫阙，今夕是何年。', '我欲乘风归去，又恐琼楼玉宇，高处不胜寒。', '起舞弄清影，何似在人间。'], 'hard', ARRAY['中秋', '思念', '哲理']),
('将进酒', '李白', '唐代', ARRAY['君不见黄河之水天上来，', '奔流到海不复回。', '君不见高堂明镜悲白发，', '朝如青丝暮成雪。'], 'medium', ARRAY['豪放', '饮酒', '人生']),
('声声慢·寻寻觅觅', '李清照', '宋代', ARRAY['寻寻觅觅，冷冷清清，', '凄凄惨惨戚戚。', '乍暖还寒时候，最难将息。'], 'hard', ARRAY['婉约', '愁绪', '女性']),
('望庐山瀑布', '李白', '唐代', ARRAY['日照香炉生紫烟，', '遥看瀑布挂前川。', '飞流直下三千尺，', '疑是银河落九天。'], 'medium', ARRAY['山水', '壮丽', '自然']),
('相思', '王维', '唐代', ARRAY['红豆生南国，', '春来发几枝。', '愿君多采撷，', '此物最相思。'], 'easy', ARRAY['爱情', '思念', '植物']),
('江雪', '柳宗元', '唐代', ARRAY['千山鸟飞绝，', '万径人踪灭。', '孤舟蓑笠翁，', '独钓寒江雪。'], 'medium', ARRAY['冬天', '孤独', '自然']),
('黄鹤楼送孟浩然之广陵', '李白', '唐代', ARRAY['故人西辞黄鹤楼，', '烟花三月下扬州。', '孤帆远影碧空尽，', '唯见长江天际流。'], 'medium', ARRAY['送别', '友情', '长江'])
ON CONFLICT DO NOTHING;

-- 启用行级安全策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
-- 用户只能访问自己的数据
CREATE POLICY "用户只能访问自己的数据" ON users FOR ALL USING (auth.uid() = id);

-- 诗词对所有认证用户可见
CREATE POLICY "诗词对所有用户可见" ON poems FOR SELECT USING (true);

-- 用户只能访问自己的解析记录
CREATE POLICY "用户只能访问自己的解析" ON poem_analyses FOR ALL USING (auth.uid() = user_id);

-- 用户只能访问自己的学习记录
CREATE POLICY "用户只能访问自己的学习记录" ON learning_records FOR ALL USING (auth.uid() = user_id);

-- 用户只能访问自己的对话
CREATE POLICY "用户只能访问自己的对话" ON ai_conversations FOR ALL USING (auth.uid() = user_id);

-- 用户只能访问自己对话的消息
CREATE POLICY "用户只能访问自己对话的消息" ON ai_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.user_id = auth.uid())
);

-- 创建匿名用户角色（用于未登录用户的基础访问）
CREATE POLICY "匿名用户可查看诗词" ON poems FOR SELECT USING (true);

-- 注释说明
COMMENT ON TABLE users IS '用户信息表';
COMMENT ON TABLE poems IS '诗词库表';
COMMENT ON TABLE poem_analyses IS '诗词解析记录表';
COMMENT ON TABLE learning_records IS '学习记录表';
COMMENT ON TABLE ai_conversations IS 'AI对话记录表';
COMMENT ON TABLE ai_messages IS 'AI对话消息表';

COMMENT ON COLUMN users.learning_progress IS '学习进度百分比';
COMMENT ON COLUMN users.streak_days IS '连续学习天数';
COMMENT ON COLUMN users.analyzed_poems IS '已解析诗词数量';
COMMENT ON COLUMN users.average_score IS '平均得分';
COMMENT ON COLUMN users.mastery_level IS '掌握程度等级';
COMMENT ON COLUMN users.weekly_activity IS '周活跃度百分比';
COMMENT ON COLUMN users.weekly_study_time IS '周学习时长（小时）';
COMMENT ON COLUMN users.completion_rate IS '任务完成率';

COMMENT ON COLUMN poems.difficulty IS '诗词难度等级';
COMMENT ON COLUMN poems.views IS '浏览量';
COMMENT ON COLUMN poems.likes IS '点赞数';

COMMENT ON COLUMN learning_records.time_spent IS '学习用时（秒）';
COMMENT ON COLUMN learning_records.score IS '学习得分';

-- 完成提示
SELECT '数据库初始化完成！' as message;