# 手动数据库设置指南

由于MCP工具连接问题，请按照以下步骤手动设置Supabase数据库。

## 步骤1：登录Supabase控制台

1. 访问 [Supabase控制台](https://supabase.com)
2. 登录您的账户
3. 选择项目：`rnvpihtnbtltaulxsunc`

## 步骤2：执行SQL迁移脚本

1. 在Supabase控制台中，点击左侧菜单的 **SQL Editor**
2. 点击 **New query** 创建新查询
3. 复制以下完整SQL脚本并粘贴到编辑器中：

```sql
-- 创建诗词解析平台数据库表结构

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
    avatar_url TEXT,
    learning_progress INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    analyzed_poems INTEGER DEFAULT 0,
    average_score NUMERIC(3,1) DEFAULT 0.0,
    mastery_level VARCHAR(20) DEFAULT 'beginner',
    weekly_activity INTEGER DEFAULT 0,
    weekly_study_time INTEGER DEFAULT 0,
    completion_rate NUMERIC(3,1) DEFAULT 0.0,
    interests TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 创建诗词表
CREATE TABLE IF NOT EXISTS poems (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    dynasty VARCHAR(50) NOT NULL,
    content TEXT[] NOT NULL,
    translation TEXT,
    difficulty VARCHAR(10) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    tags TEXT[],
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建诗词解析表
CREATE TABLE IF NOT EXISTS poem_analyses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    word_analysis JSONB,
    imagery_analysis JSONB,
    overall_analysis JSONB,
    author_info JSONB,
    historical_context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建学习记录表
CREATE TABLE IF NOT EXISTS learning_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES poem_analyses(id) ON DELETE SET NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    time_spent INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建AI对话表
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES poems(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建AI消息表
CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(10) CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_poems_author ON poems(author);
CREATE INDEX IF NOT EXISTS idx_poems_difficulty ON poems(difficulty);
CREATE INDEX IF NOT EXISTS idx_poem_analyses_poem_user ON poem_analyses(poem_id, user_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_user_poem ON learning_records(user_id, poem_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id);

-- 启用行级安全策略(RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE poem_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略确保数据安全
-- 用户表策略：用户只能访问自己的数据
CREATE POLICY "用户只能访问自己的数据" ON users
    FOR ALL USING (auth.uid() = id);

-- 诗词表策略：所有用户都可以查看诗词
CREATE POLICY "所有用户都可以查看诗词" ON poems
    FOR SELECT USING (true);

-- 诗词解析表策略：用户只能访问自己的解析
CREATE POLICY "用户只能访问自己的解析" ON poem_analyses
    FOR ALL USING (auth.uid() = user_id);

-- 学习记录表策略：用户只能访问自己的记录
CREATE POLICY "用户只能访问自己的学习记录" ON learning_records
    FOR ALL USING (auth.uid() = user_id);

-- AI对话表策略：用户只能访问自己的对话
CREATE POLICY "用户只能访问自己的对话" ON ai_conversations
    FOR ALL USING (auth.uid() = user_id);

-- AI消息表策略：用户只能访问自己对话的消息
CREATE POLICY "用户只能访问自己对话的消息" ON ai_messages
    FOR ALL USING (EXISTS (
        SELECT 1 FROM ai_conversations 
        WHERE ai_conversations.id = ai_messages.conversation_id 
        AND ai_conversations.user_id = auth.uid()
    ));

-- 插入示例诗词数据
INSERT INTO poems (title, author, dynasty, content, difficulty, tags) VALUES
('静夜思', '李白', '唐', ARRAY['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。'], 'easy', ARRAY['思乡', '月亮', '夜晚']),
('春晓', '孟浩然', '唐', ARRAY['春眠不觉晓，', '处处闻啼鸟。', '夜来风雨声，', '花落知多少。'], 'easy', ARRAY['春天', '自然', '早晨']),
('登鹳雀楼', '王之涣', '唐', ARRAY['白日依山尽，', '黄河入海流。', '欲穷千里目，', '更上一层楼。'], 'medium', ARRAY['登高', '壮丽', '哲理']),
('望庐山瀑布', '李白', '唐', ARRAY['日照香炉生紫烟，', '遥看瀑布挂前川。', '飞流直下三千尺，', '疑是银河落九天。'], 'medium', ARRAY['山水', '壮丽', '自然']),
('江雪', '柳宗元', '唐', ARRAY['千山鸟飞绝，', '万径人踪灭。', '孤舟蓑笠翁，', '独钓寒江雪。'], 'hard', ARRAY['孤独', '冬天', '意境'])
ON CONFLICT DO NOTHING;

-- 创建自动更新时间戳的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要updated_at字段的表创建触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poems_updated_at BEFORE UPDATE ON poems FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poem_analyses_updated_at BEFORE UPDATE ON poem_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. 点击 **Run** 执行脚本
5. 等待执行完成，检查是否有错误

## 步骤3：验证表创建

1. 在Supabase控制台中，点击左侧菜单的 **Table Editor**
2. 确认以下表已创建：
   - users
   - poems  
   - poem_analyses
   - learning_records
   - ai_conversations
   - ai_messages

## 步骤4：配置Netlify环境变量

按照 [Netlify配置指南](./NETLIFY_SETUP.md) 设置环境变量。

## 故障排除

### 常见问题

1. **权限错误**
   - 确保您有项目的管理员权限
   - 检查SQL语句的语法是否正确

2. **表已存在错误**
   - 如果表已存在，脚本会跳过创建（使用IF NOT EXISTS）

3. **扩展启用失败**
   - 确保您的Supabase项目支持uuid-ossp扩展

### 获取帮助

如果遇到问题：
1. 检查Supabase文档
2. 查看SQL错误信息
3. 联系Supabase支持

## 完成验证

数据库设置完成后，您的诗词解析平台就可以正常使用了！