-- Seed Data for Luxury Catering App
-- Run this in Supabase SQL Editor after migration.sql

-- Admin user (email: admin@exquisitemeals.com / password: admin123!)
INSERT INTO "users" ("id", "email", "passwordHash", "name", "phone", "role", "dietaryPreferences", "allergies", "rewardsPoints", "rewardsTier", "totalOrders", "referralCode", "createdAt", "updatedAt")
VALUES ('admin-001', 'admin@exquisitemeals.com', '$2a$12$E061qDY/WA0zX5r0OQbYxukgcuHQ/9o81Qw5P8vcEZv41RANxtnLW', 'Admin', '+1 (555) 000-0000', 'ADMIN', ARRAY[]::TEXT[], ARRAY[]::TEXT[], 0, 'BRONZE', 0, 'EXQ-ADMIN0', NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;

-- Demo customer (email: alex@example.com / password: customer123!)
INSERT INTO "users" ("id", "email", "passwordHash", "name", "phone", "role", "dietaryPreferences", "allergies", "rewardsPoints", "rewardsTier", "totalOrders", "referralCode", "createdAt", "updatedAt")
VALUES ('customer-001', 'alex@example.com', '$2a$12$VcktpL/Xg6Kd/Id4X6qZQOwnavLEippb.Jke9zew/8QL2z/kb6iYC', 'Alexandra Chen', '+1 (555) 123-4567', 'CUSTOMER', ARRAY['gluten-free']::TEXT[], ARRAY[]::TEXT[], 2450, 'SILVER', 24, 'EXQ-ALEXCH', NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;

-- Customer address
INSERT INTO "addresses" ("id", "userId", "label", "street", "city", "state", "zip", "isDefault", "createdAt")
VALUES ('addr-001', 'customer-001', 'Home', '123 Park Avenue', 'New York', 'NY', '10001', true, NOW());

-- Menu Items (12 items across 3 categories)
INSERT INTO "menu_items" ("id", "name", "description", "price", "image", "category", "tags", "calories", "prepTime", "servings", "featured", "popular", "available", "createdAt", "updatedAt") VALUES
('mi-001', 'Herb-Crusted Salmon', 'Wild-caught Atlantic salmon with a fragrant herb crust, served with roasted asparagus and lemon butter sauce.', 28.99, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80', 'MEAL_PREP', ARRAY['gluten-free','high-protein'], 520, '25 min', NULL, true, true, true, NOW(), NOW()),
('mi-002', 'Truffle Mushroom Risotto', 'Creamy Arborio rice with wild mushrooms, finished with truffle oil and aged Parmesan.', 24.99, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80', 'MEAL_PREP', ARRAY['vegetarian'], 680, '30 min', NULL, true, false, true, NOW(), NOW()),
('mi-003', 'Wagyu Beef Tenderloin', 'Premium A5 Wagyu beef, seared to perfection with a red wine reduction and roasted vegetables.', 54.99, 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80', 'MEAL_PREP', ARRAY['high-protein','gluten-free'], 720, '35 min', NULL, false, true, true, NOW(), NOW()),
('mi-004', 'Mediterranean Grain Bowl', 'Quinoa and farro blend with roasted chickpeas, sun-dried tomatoes, kalamata olives, and tahini dressing.', 18.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', 'MEAL_PREP', ARRAY['vegan','dairy-free'], 480, '20 min', NULL, false, false, true, NOW(), NOW()),
('mi-005', 'Grilled Chicken Caesar', 'Tender grilled chicken breast over crisp romaine, shaved Parmesan, and house-made Caesar dressing.', 16.99, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80', 'MEAL_PREP', ARRAY['high-protein'], 450, '15 min', NULL, false, false, true, NOW(), NOW()),
('mi-006', 'Family Pasta Night', 'House-made pappardelle with slow-braised short rib ragù, fresh herbs, and pecorino. Serves 4-6.', 65.99, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80', 'FAMILY_MEALS', ARRAY[]::TEXT[], NULL, '15 min reheat', 6, true, false, true, NOW(), NOW()),
('mi-007', 'Sunday Roast Chicken', 'Whole roasted free-range chicken with herb stuffing, roasted root vegetables, and homemade gravy. Serves 4-6.', 58.99, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80', 'FAMILY_MEALS', ARRAY['gluten-free'], NULL, '20 min reheat', 6, false, true, true, NOW(), NOW()),
('mi-008', 'Thai Coconut Curry Feast', 'Aromatic green curry with seasonal vegetables, jasmine rice, and crispy spring rolls. Serves 4-6.', 52.99, 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80', 'FAMILY_MEALS', ARRAY['dairy-free'], NULL, '15 min reheat', 6, false, false, true, NOW(), NOW()),
('mi-009', 'Family BBQ Platter', 'Smoked brisket, pulled pork, cornbread, coleslaw, and baked beans. Serves 6-8.', 79.99, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80', 'FAMILY_MEALS', ARRAY['gluten-free'], NULL, '20 min reheat', 8, false, false, true, NOW(), NOW()),
('mi-010', 'Elegant Cocktail Reception', 'A curated selection of canapés, charcuterie, artisan cheeses, and seasonal crostini. For 20-50 guests.', 899.99, 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80', 'CATERING', ARRAY[]::TEXT[], NULL, NULL, 50, true, false, true, NOW(), NOW()),
('mi-011', 'Executive Lunch Package', 'Premium boxed lunches with gourmet sandwiches, salads, and desserts. Minimum 10 guests.', 34.99, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', 'CATERING', ARRAY[]::TEXT[], NULL, NULL, 10, false, false, true, NOW(), NOW()),
('mi-012', 'Wedding Dinner Service', 'Full-service plated dinner with appetizer, entrée choice, and dessert. Custom menu consultation included.', 1499.99, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', 'CATERING', ARRAY[]::TEXT[], NULL, NULL, 100, false, false, true, NOW(), NOW());

-- Rewards catalog
INSERT INTO "rewards" ("id", "name", "description", "pointsCost", "active") VALUES
('rw-001', 'Free Appetizer', 'Any appetizer from the menu', 500, true),
('rw-002', '$10 Off Next Order', 'Applied automatically at checkout', 1000, true),
('rw-003', 'Free Family Meal Upgrade', 'Upgrade any family meal to premium', 2000, true),
('rw-004', 'Private Chef Experience', '2-hour private chef session at your home', 5000, true);

-- Promotions
INSERT INTO "promotions" ("id", "title", "description", "image", "discount", "validUntil", "active", "createdAt") VALUES
('promo-001', 'First Order Special', '20% off your first meal prep order', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', '20% OFF', '2026-04-30 00:00:00', true, NOW()),
('promo-002', 'Family Fridays', 'Free dessert with every family meal on Fridays', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80', 'FREE DESSERT', '2026-05-15 00:00:00', true, NOW());
