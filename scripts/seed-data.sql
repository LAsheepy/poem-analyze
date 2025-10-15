-- 诗韵星示例数据填充脚本
-- 在Supabase SQL Editor中运行此脚本

-- 1. 插入示例诗词数据
INSERT INTO poems (title, author, dynasty, content, difficulty, tags) VALUES
('静夜思', '李白', '唐', ARRAY['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'], 'easy', ARRAY['思乡', '月亮', '夜晚']),
('春晓', '孟浩然', '唐', ARRAY['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'], 'easy', ARRAY['春天', '自然', '生活']),
('登鹳雀楼', '王之涣', '唐', ARRAY['白日依山尽', '黄河入海流', '欲穷千里目', '更上一层楼'], 'medium', ARRAY['登高', '哲理', '壮丽']),
('望庐山瀑布', '李白', '唐', ARRAY['日照香炉生紫烟', '遥看瀑布挂前川', '飞流直下三千尺', '疑是银河落九天'], 'medium', ARRAY['山水', '壮丽', '自然']),
('江雪', '柳宗元', '唐', ARRAY['千山鸟飞绝', '万径人踪灭', '孤舟蓑笠翁', '独钓寒江雪'], 'hard', ARRAY['孤独', '冬天', '哲理']),
('悯农', '李绅', '唐', ARRAY['锄禾日当午', '汗滴禾下土', '谁知盘中餐', '粒粒皆辛苦'], 'easy', ARRAY['农民', '劳动', '珍惜']),
('相思', '王维', '唐', ARRAY['红豆生南国', '春来发几枝', '愿君多采撷', '此物最相思'], 'medium', ARRAY['爱情', '思念', '红豆']),
('黄鹤楼送孟浩然之广陵', '李白', '唐', ARRAY['故人西辞黄鹤楼', '烟花三月下扬州', '孤帆远影碧空尽', '唯见长江天际流'], 'hard', ARRAY['送别', '友情', '长江']),
('枫桥夜泊', '张继', '唐', ARRAY['月落乌啼霜满天', '江枫渔火对愁眠', '姑苏城外寒山寺', '夜半钟声到客船'], 'medium', ARRAY['夜晚', '思乡', '苏州']),
('游子吟', '孟郊', '唐', ARRAY['慈母手中线', '游子身上衣', '临行密密缝', '意恐迟迟归', '谁言寸草心', '报得三春晖'], 'medium', ARRAY['母爱', '亲情', '感恩'])
ON CONFLICT (title, author) DO NOTHING;

-- 2. 创建示例用户（如果不存在）
-- 注意：实际用户将通过认证系统创建，这里只是示例数据
INSERT INTO users (id, username, email, role, learning_progress, streak_days, analyzed_poems, average_score, mastery_level, weekly_activity, weekly_study_time, completion_rate, interests) VALUES
('00000000-0000-0000-0000-000000000001', '诗词爱好者', 'poetry@example.com', 'student', 75, 14, 25, 82, '中级', 65, 8, 80, ARRAY['唐诗', '宋词', '山水诗']),
('00000000-0000-0000-0000-000000000002', '文学教师', 'teacher@example.com', 'teacher', 95, 30, 50, 90, '高级', 85, 12, 95, ARRAY['古诗', '文学史', '诗词鉴赏'])
ON CONFLICT (id) DO NOTHING;

-- 3. 插入示例学习记录
INSERT INTO learning_records (user_id, poem_id, score, time_spent, completed, notes) VALUES
('00000000-0000-0000-0000-000000000001', (SELECT id FROM poems WHERE title = '静夜思'), 85, 1200, true, '对思乡情感理解深刻'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM poems WHERE title = '春晓'), 78, 900, true, '对春天意境的把握较好'),
('00000000-0000-0000-0000-000000000001', (SELECT id FROM poems WHERE title = '登鹳雀楼'), 92, 1800, true, '哲理分析到位'),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM poems WHERE title = '望庐山瀑布'), 95, 1500, true, '作为教学示例分析')
ON CONFLICT DO NOTHING;

-- 4. 插入示例AI对话
INSERT INTO ai_conversations (user_id, title) VALUES
('00000000-0000-0000-0000-000000000001', '李白诗歌风格探讨'),
('00000000-0000-0000-0000-000000000001', '唐诗与宋词的区别')
ON CONFLICT DO NOTHING;

-- 5. 插入示例AI消息
INSERT INTO ai_messages (conversation_id, role, content) VALUES
((SELECT id FROM ai_conversations WHERE title = '李白诗歌风格探讨'), 'user', '李白的诗歌有什么特点？'),
((SELECT id FROM ai_conversations WHERE title = '李白诗歌风格探讨'), 'assistant', '李白的诗歌以豪放飘逸著称，善于运用夸张、想象等手法，语言清新自然，意境开阔。'),
((SELECT id FROM ai_conversations WHERE title = '唐诗与宋词的区别'), 'user', '唐诗和宋词有什么区别？'),
((SELECT id FROM ai_conversations WHERE title = '唐诗与宋词的区别'), 'assistant', '唐诗注重格律和意境，形式较为固定；宋词更注重音乐性和情感表达，形式更加灵活多样。')
ON CONFLICT DO NOTHING;

-- 6. 验证数据插入
SELECT '诗词数据:' as category, COUNT(*) as count FROM poems
UNION ALL
SELECT '用户数据:', COUNT(*) FROM users
UNION ALL
SELECT '学习记录:', COUNT(*) FROM learning_records
UNION ALL
SELECT 'AI对话:', COUNT(*) FROM ai_conversations
UNION ALL
SELECT 'AI消息:', COUNT(*) FROM ai_messages;