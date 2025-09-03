import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedMockData1756742441647 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Seed categories
        await queryRunner.query(`
            INSERT INTO "categories" ("id", "name", "imageUrl", "createdAt") VALUES
            ('440e8400-e29b-41d4-a716-446655440001', 'Notebooks & Paper', '/school-notebooks-and-paper-supplies.png', '2024-01-01 00:00:00'),
            ('440e8400-e29b-41d4-a716-446655440002', 'Writing Materials', '/pens-pencils-writing-materials.png', '2024-01-01 00:00:00'),
            ('440e8400-e29b-41d4-a716-446655440003', 'Art Supplies', '/art-supplies-crayons-paints.png', '2024-01-01 00:00:00'),
            ('440e8400-e29b-41d4-a716-446655440004', 'School Bags', '/colorful-school-backpacks.png', '2024-01-01 00:00:00'),
            ('440e8400-e29b-41d4-a716-446655440005', 'Calculators', '/scientific-calculators.png', '2024-01-01 00:00:00'),
            ('440e8400-e29b-41d4-a716-446655440006', 'Sports Equipment', '/school-sports-equipment.png', '2024-01-01 00:00:00'),
            ('440e8400-e29b-41d4-a716-446655440007', 'Uniforms', '/school-uniform-shirt.png', '2024-01-01 00:00:00'),
            ('440e8400-e29b-41d4-a716-446655440008', 'Accessories', '/school-pencil-case.png', '2024-01-01 00:00:00')
        `);

        // Seed users
        await queryRunner.query(`
            INSERT INTO "users" ("id", "email", "password", "firstName", "lastName", "phone", "role", "status", "isEmailVerified", "createdAt", "updatedAt") VALUES
            ('550e8400-e29b-41d4-a716-446655440001', 'john.doe@email.com', '$2a$10$hashedpassword1', 'John', 'Doe', '+250 788 123 456', 'parent', 'active', true, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
            ('550e8400-e29b-41d4-a716-446655440002', 'mary.smith@email.com', '$2a$10$hashedpassword2', 'Mary', 'Smith', '+250 788 987 654', 'parent', 'active', true, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
            ('550e8400-e29b-41d4-a716-446655440003', 'admin@schoolmart.com', '$2a$10$hashedpassword3', 'Admin', 'User', '+250 788 000 000', 'school_manager', 'active', true, '2024-01-01 00:00:00', '2024-01-01 00:00:00')
        `);

        // Seed products
        await queryRunner.query(`
            INSERT INTO "products" ("id", "name", "category", "price", "stock", "minStock", "required", "description", "supplier", "imageUrl", "lastUpdated") VALUES
            ('660e8400-e29b-41d4-a716-446655440001', 'Premium School Backpack', 'School Bags', 15000, 25, 10, true, 'Spacious and durable backpack with multiple compartments, padded straps, and water-resistant material.', 'BagCorp Ltd', '/premium-blue-school-backpack.png', '2024-01-20 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440002', 'Scientific Calculator', 'Calculators', 8500, 15, 5, false, 'Advanced scientific calculator with 240+ functions, perfect for mathematics and physics.', 'TechSupply Co', '/scientific-calculator.png', '2024-01-19 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440003', 'Art Supply Kit', 'Art Supplies', 12000, 8, 15, false, 'Complete art set including colored pencils, markers, paints, and brushes.', 'Creative Arts Ltd', '/complete-art-supply-kit.png', '2024-01-17 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440004', 'Notebook Set (5 Pack)', 'Notebooks & Paper', 3200, 50, 20, true, 'Set of 5 high-quality notebooks with lined pages and durable covers.', 'Paper Plus', '/school-notebook-set.png', '2024-01-18 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440005', 'Geometry Set', 'Writing Materials', 4800, 30, 10, true, 'Complete geometry set with compass, protractor, rulers, and triangles.', 'Stationery Pro', '/geometry-compass-ruler-set.png', '2024-01-16 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440006', 'Colored Pencils', 'Art Supplies', 2500, 40, 15, false, 'Set of 24 vibrant colored pencils with smooth application.', 'Artistic Supplies', '/colored-pencils-set.png', '2024-01-15 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440007', 'School Uniform', 'Uniforms', 18000, 30, 10, true, 'High-quality school uniform shirt made from comfortable fabric.', 'Uniform Masters', '/school-uniform-shirt.png', '2024-01-16 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440008', 'Water Bottle', 'Accessories', 3800, 35, 12, false, 'BPA-free water bottle with leak-proof design.', 'Bottle Corp', '/school-water-bottle.png', '2024-01-14 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440009', 'Lunch Box', 'Accessories', 5200, 20, 8, false, 'Insulated lunch box with multiple compartments.', 'Lunch Box Ltd', '/colorful-school-lunch-box.png', '2024-01-13 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440010', 'Exercise Books', 'Notebooks & Paper', 1800, 60, 25, true, 'Pack of exercise books with quality paper and durable covers.', 'Paper Plus', '/school-exercise-books.png', '2024-01-12 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440011', 'Pencil Case', 'Accessories', 2800, 25, 10, false, 'Spacious pencil case with multiple compartments.', 'Stationery Pro', '/school-pencil-case.png', '2024-01-11 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440012', 'Ruler Set', 'Writing Materials', 1500, 45, 15, true, 'Set of rulers with clear markings in metric and imperial units.', 'Measuring Tools Inc', '/placeholder.jpg?height=250&width=250', '2024-01-10 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440013', 'Highlighter Set', 'Writing Materials', 2200, 30, 10, false, 'Set of 6 fluorescent highlighters in different colors.', 'Writing Essentials', '/placeholder.jpg?height=250&width=250', '2024-01-09 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440014', 'Sports Equipment Kit', 'Sports Equipment', 25000, 5, 3, false, 'Complete sports kit including ball, cones, and accessories.', 'Sports Gear Ltd', '/school-sports-equipment.png', '2024-01-08 00:00:00'),
            ('660e8400-e29b-41d4-a716-446655440015', 'Lab Coat', 'Uniforms', 8000, 12, 5, true, 'White lab coat for science experiments and practical sessions.', 'Lab Wear Co', '/placeholder.jpg?height=250&width=250', '2024-01-07 00:00:00')
        `);

        // Seed orders
        await queryRunner.query(`
            INSERT INTO "orders" ("id", "userId", "parentName", "parentEmail", "parentPhone", "studentName", "studentGrade", "studentClass", "totalAmount", "status", "orderDate", "paymentMethod", "deliveryAddress", "createdAt", "updatedAt") VALUES
            ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john.doe@email.com', '+250 788 123 456', 'Jane Doe', 'Grade 5', '5A', 23500, 'pending', '2024-01-20 00:00:00', 'MTN MoMo', 'Kigali, Rwanda', '2024-01-20 00:00:00', '2024-01-20 00:00:00'),
            ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Mary Smith', 'mary.smith@email.com', '+250 788 987 654', 'Tom Smith', 'Grade 4', '4B', 18400, 'processing', '2024-01-19 00:00:00', 'Airtel Money', 'Kigali, Rwanda', '2024-01-19 00:00:00', '2024-01-19 00:00:00'),
            ('770e8400-e29b-41d4-a716-446655440003', NULL, 'David Wilson', 'david.wilson@email.com', '+250 788 456 789', 'Sarah Wilson', 'Grade 6', '6A', 40800, 'shipped', '2024-01-18 00:00:00', 'Visa Card', 'Kigali, Rwanda', '2024-01-18 00:00:00', '2024-01-18 00:00:00'),
            ('770e8400-e29b-41d4-a716-446655440004', NULL, 'Alice Johnson', 'alice.johnson@email.com', '+250 788 321 654', 'Mike Johnson', 'Grade 3', '3C', 11500, 'delivered', '2024-01-17 00:00:00', 'MTN MoMo', 'Kigali, Rwanda', '2024-01-17 00:00:00', '2024-01-17 00:00:00')
        `);

        // Seed order items
        await queryRunner.query(`
            INSERT INTO "order_items" ("id", "orderId", "productId", "productName", "quantity", "price", "category") VALUES
            ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Premium School Backpack', 1, 15000, 'School Bags'),
            ('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Scientific Calculator', 1, 8500, 'Calculators'),
            ('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004', 'Notebook Set (5 Pack)', 2, 3200, 'Notebooks & Paper'),
            ('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 'Art Supply Kit', 1, 12000, 'Art Supplies'),
            ('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440007', 'School Uniform', 2, 18000, 'Uniforms'),
            ('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', 'Geometry Set', 1, 4800, 'Writing Materials'),
            ('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440008', 'Water Bottle', 1, 3800, 'Accessories'),
            ('880e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440009', 'Lunch Box', 1, 5200, 'Accessories'),
            ('880e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440006', 'Colored Pencils', 1, 2500, 'Art Supplies')
        `);

        // Seed cart items
        await queryRunner.query(`
            INSERT INTO "cart_items" ("id", "userId", "productId", "productName", "quantity", "price", "category", "imageUrl", "createdAt", "updatedAt") VALUES
            ('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Premium School Backpack', 1, 15000, 'School Bags', '/premium-blue-school-backpack.png', '2024-01-20 00:00:00', '2024-01-20 00:00:00'),
            ('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Scientific Calculator', 2, 8500, 'Calculators', '/scientific-calculator.png', '2024-01-20 00:00:00', '2024-01-20 00:00:00'),
            ('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 'Notebook Set (5 Pack)', 1, 3200, 'Notebooks & Paper', '/school-notebook-set.png', '2024-01-20 00:00:00', '2024-01-20 00:00:00')
        `);

        // Seed notifications
        await queryRunner.query(`
            INSERT INTO "notifications" ("id", "userId", "message", "type", "priority", "read", "createdAt", "updatedAt") VALUES
            ('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'New school supplies list available for Grade 5', 'school', 'high', false, '2024-01-20 00:00:00', '2024-01-20 00:00:00'),
            ('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Your order #ORD-001 has been delivered', 'order', 'medium', true, '2024-01-19 00:00:00', '2024-01-19 00:00:00'),
            ('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Reminder: Science lab materials needed by Feb 1st', 'school', 'high', false, '2024-01-18 00:00:00', '2024-01-18 00:00:00'),
            ('aa0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Parent-teacher meeting scheduled for Feb 5th', 'school', 'high', false, '2024-01-17 00:00:00', '2024-01-17 00:00:00'),
            ('aa0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Payment confirmation for January supplies', 'payment', 'low', true, '2024-01-15 00:00:00', '2024-01-15 00:00:00'),
            ('aa0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'New sports equipment available for purchase', 'announcement', 'low', true, '2024-01-12 00:00:00', '2024-01-12 00:00:00')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove seeded data
        await queryRunner.query(`DELETE FROM "notifications" WHERE "id" LIKE 'aa0e8400-e29b-41d4-a716-446655440%'`);
        await queryRunner.query(`DELETE FROM "cart_items" WHERE "id" LIKE '990e8400-e29b-41d4-a716-446655440%'`);
        await queryRunner.query(`DELETE FROM "order_items" WHERE "id" LIKE '880e8400-e29b-41d4-a716-446655440%'`);
        await queryRunner.query(`DELETE FROM "orders" WHERE "id" LIKE '770e8400-e29b-41d4-a716-446655440%'`);
        await queryRunner.query(`DELETE FROM "products" WHERE "id" LIKE '660e8400-e29b-41d4-a716-446655440%'`);
        await queryRunner.query(`DELETE FROM "users" WHERE "id" LIKE '550e8400-e29b-41d4-a716-446655440%'`);
        await queryRunner.query(`DELETE FROM "categories" WHERE "id" LIKE '440e8400-e29b-41d4-a716-446655440%'`);
    }

}
