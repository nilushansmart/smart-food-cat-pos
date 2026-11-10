-- V2__seed_data.sql
-- Seed initial roles, users, categories, and catering menu items

-- Passwords are all hashed with BCrypt for 'password123':
-- $2a$10$odJVbEQyd7M0VF.kumExkezEvvh.g5n9E9f/NccfrhGAn/0/Sxb/q
INSERT INTO users (username, email, password_hash, full_name, phone, role, active, branch_id) VALUES
('admin', 'admin@stitchcatering.com', '$2a$10$odJVbEQyd7M0VF.kumExkezEvvh.g5n9E9f/NccfrhGAn/0/Sxb/q', 'Vikram Sethi (Admin)', '+15550192831', 'ROLE_ADMIN', TRUE, 'MAIN'),
('staff', 'staff@stitchcatering.com', '$2a$10$odJVbEQyd7M0VF.kumExkezEvvh.g5n9E9f/NccfrhGAn/0/Sxb/q', 'Maya Jayasinghe (Staff)', '+15558291920', 'ROLE_STAFF', TRUE, 'MAIN'),
('kitchen', 'kitchen@stitchcatering.com', '$2a$10$odJVbEQyd7M0VF.kumExkezEvvh.g5n9E9f/NccfrhGAn/0/Sxb/q', 'Chef Anura & Kitchen Crew', '+15554412900', 'ROLE_KITCHEN', TRUE, 'MAIN'),
('customer', 'customer@gmail.com', '$2a$10$odJVbEQyd7M0VF.kumExkezEvvh.g5n9E9f/NccfrhGAn/0/Sxb/q', 'Kavindu Customer', '+15559021823', 'ROLE_CUSTOMER', TRUE, 'MAIN');

-- Insert Categories
INSERT INTO categories (id, name, description, display_order, active) VALUES
(1, 'Catering Trays', 'Large party trays, banquet platters, and buffet packs for groups', 1, TRUE),
(2, 'Rice', 'Aromatic spiced rice, biryani sets, and wok-tossed bowls', 2, TRUE),
(3, 'Snacks', 'Crispy appetizers, finger foods, and savory catering platters', 3, TRUE),
(4, 'Desserts', 'Artisan puddings, traditional sweets, and bakery treats', 4, TRUE),
(5, 'Beverages', 'Party beverage dispensers, chilled lassi jars, and artisan iced teas', 5, TRUE);

-- Insert Menu Items
INSERT INTO menu_items (id, category_id, name, description, price, image_url, prep_time_minutes, pax, available, branch_id) VALUES
(1, 1, 'Grand Biryani Feast Tray (10-12 Pax)', 'Large catering party tray of aromatic Chicken Dum Biryani served with 12 boiled eggs, mint raita, spicy gravy, and pineapple chutney.', 95.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', 45, '10-12 Guests', TRUE, 'MAIN'),
(2, 1, 'Corporate Executive Bento Box Set', 'Individual catering lunch pack: fragrant ghee rice, butter chicken or fish, vegetable cutlet, salad, and caramel pudding.', 18.50, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80', 20, 'Per Person', TRUE, 'MAIN'),
(3, 1, 'Party Cocktail Snacks Platter (30 Pcs)', 'Assorted finger food platter: 10 veggie samosas, 10 chicken spring rolls, and 10 mini mutton cutlets with tangy dips.', 45.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80', 25, '15-20 Guests', TRUE, 'MAIN'),
(4, 2, 'Royal Chicken Biryani (Single Box)', 'Long grain aromatic basmati rice cooked with tender marinated chicken, saffron, and boiled egg.', 12.50, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', 15, '1 Guest', TRUE, 'MAIN'),
(5, 2, 'Fragrant Ghee Rice & Curry Set', 'Rich ghee infused rice served with spicy dhal curry and caramelized crispy shallots.', 10.00, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80', 10, '1 Guest', TRUE, 'MAIN'),
(6, 2, 'Seafood Nasi Goreng Buffet Bowl', 'Indonesian wok-fried rice tossed with prawns, calamari, chicken satay skewer, and sunny-side egg.', 13.90, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80', 12, '1 Guest', TRUE, 'MAIN'),
(7, 3, 'Crispy Veggie Samosas (4 pcs)', 'Golden triangular pastry pockets stuffed with spiced potatoes, green peas, and tangy mint chutney.', 5.50, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80', 8, '1-2 Guests', TRUE, 'MAIN'),
(8, 3, 'Mini Mutton Cutlet Balls (6 pcs)', 'Savory minced spiced mutton and mashed potatoes, crumbed and fried to crisp perfection.', 7.50, 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&auto=format&fit=crop&q=80', 10, '1-2 Guests', TRUE, 'MAIN'),
(9, 4, 'Silky Caramel Pudding (6 Cups)', 'Classic melt-in-the-mouth steamed egg custard drenched with dark golden caramel glaze in party cups.', 18.00, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80', 5, '6 Guests', TRUE, 'MAIN'),
(10, 4, 'Royal Spiced Watalappan Pot', 'Traditional coconut jaggery pudding infused with cardamom, nutmeg, and roasted cashew nuts for 8-10 guests.', 24.00, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=80', 5, '8-10 Guests', TRUE, 'MAIN'),
(11, 5, 'Fresh Mint Lime Soda Dispenser (5L)', 'Refreshing party beverage jar filled with fresh lime, crushed mint leaves, and sparkling soda.', 28.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80', 10, '15-20 Guests', TRUE, 'MAIN'),
(12, 5, 'Alphonso Mango Lassi Bottle (1L)', 'Creamy chilled yogurt drink blended with ripe sweet Alphonso mango pulp and cardamom.', 12.00, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80', 5, '3-4 Guests', TRUE, 'MAIN');

-- Insert Initial Sample Bookings
INSERT INTO orders (id, order_number, customer_name, customer_phone, order_type, status, payment_status, payment_method, event_date, event_time, event_type, guest_count, delivery_address, subtotal, tax_amount, total_amount, user_id, branch_id, created_at) VALUES
(1, 'ORD-1081', 'Aarav Perera', '+15552348890', 'ONLINE_DELIVERY', 'PREPARING', 'PAID', 'ONLINE_CARD', CURDATE(), '01:30 PM (Lunch)', 'Corporate Luncheon', '25 Guests', 'Tech Hub Towers, 5th Floor, 42 Cyber Way', 218.00, 10.90, 228.90, 1, 'MAIN', NOW() - INTERVAL 45 MINUTE),
(2, 'ORD-1082', 'Elena Rostova', '+15554923118', 'ONLINE_DELIVERY', 'PENDING', 'PENDING', 'CASH_ON_DELIVERY', CURDATE(), '07:00 PM (Dinner)', 'Birthday Celebration', '15 Guests', 'Villa 14, Lotus Grove Residential Park', 138.00, 6.90, 144.90, 2, 'MAIN', NOW() - INTERVAL 12 MINUTE),
(3, 'ORD-1080', 'Devin Fernando', '+15557731002', 'SCHEDULED_PICKUP', 'READY', 'PAID', 'ONLINE_CARD', CURDATE(), '12:00 PM (Noon)', 'Family Gathering', '10 Guests', 'Customer Self-Pickup at Central Kitchen Counter', 131.00, 6.55, 137.55, 1, 'MAIN', NOW() - INTERVAL 75 MINUTE);

-- Insert Sample Order Items
INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, unit_price, subtotal, special_note) VALUES
(1, 1, 'Grand Biryani Feast Tray (10-12 Pax)', 2, 95.00, 190.00, 'Extra raita & spicy gravy on the side'),
(1, 11, 'Fresh Mint Lime Soda Dispenser (5L)', 1, 28.00, 28.00, 'Include party cups and ice'),
(2, 3, 'Party Cocktail Snacks Platter (30 Pcs)', 2, 45.00, 90.00, 'Gluten-free labels please'),
(2, 10, 'Royal Spiced Watalappan Pot', 2, 24.00, 48.00, 'Cardamom aroma'),
(3, 1, 'Grand Biryani Feast Tray (10-12 Pax)', 1, 95.00, 95.00, 'Insulated hot box packing'),
(3, 9, 'Silky Caramel Pudding (6 Cups)', 2, 18.00, 36.00, 'Extra caramel sauce');

