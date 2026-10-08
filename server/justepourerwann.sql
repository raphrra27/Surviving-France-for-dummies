USE surviving_france;

-- Use the first existing user as the author
SET @author_id = (
    SELECT id
    FROM users
    ORDER BY id
    LIMIT 1
);

INSERT INTO articles (
    title,
    slug,
    category,
    cover_image_url,
    summary,
    content,
    status,
    read_time_minutes,
    author_id
) VALUES
(
    'A Morning at the French Market',
    'a-morning-at-the-french-market',
    'everyday_life',
    '/articleimage/testchien.webp',
    'Discover what to expect during a relaxed morning at a French market.',
    'French markets are lively places where people buy fresh vegetables, cheese, bread, and seasonal products. Start by saying bonjour to the seller, then take your time looking at the different products. A small conversation with the vendor is often part of the experience. Do not forget to say merci before leaving.',
    'published',
    4,
    @author_id
),
(
    'A Short History of the French Revolution',
    'a-short-history-of-the-french-revolution',
    'culture',
    '/articleimage/revoution.webp',
    'A simple introduction to the events that changed French history.',
    'The French Revolution began in 1789 during a period of social and financial crisis. It changed the political organization of France and introduced important ideas about liberty, equality, and citizenship. Its consequences continued to influence France and Europe for many years.',
    'published',
    5,
    @author_id
),
(
    'How to Use Public Transport in France',
    'how-to-use-public-transport-in-france',
    'transport',
    '/logo.png',
    'A practical guide to buses, trains, and metro systems in French cities.',
    'Public transport is one of the easiest ways to travel around French cities. In larger cities, you can usually use a metro, tram, or bus ticket. Check the ticket rules before travelling, validate your ticket when required, and keep it until the end of your journey. If you are unsure, ask someone politely for help.',
    'published',
    3,
    @author_id
);
