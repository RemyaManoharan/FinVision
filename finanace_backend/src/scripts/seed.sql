-- Default categories for all users
INSERT INTO income_categories (user_id, name, is_default) VALUES 
(NULL, 'Salary', TRUE),
(NULL, 'Investment', TRUE),
(NULL, 'Rental', TRUE),
(NULL, 'Freelance', TRUE),
(NULL, 'Business', TRUE),
(NULL, 'Gifts', TRUE),
(NULL, 'Other', TRUE);

INSERT INTO expense_categories (user_id, name, is_default) VALUES 
(NULL, 'Food', TRUE),
(NULL, 'Housing', TRUE),
(NULL, 'Transportation', TRUE),
(NULL, 'Shopping', TRUE),
(NULL, 'Entertainment', TRUE),
(NULL, 'Utilities', TRUE),
(NULL, 'Subscriptions', TRUE),
(NULL, 'EMI', TRUE),
(NULL, 'Health', TRUE),
(NULL, 'Education', TRUE),
(NULL, 'Travel', TRUE),
(NULL, 'Insurance', TRUE),
(NULL, 'Taxes', TRUE),
(NULL, 'Other', TRUE);

-- Sample test user (password: 'password123' hashed)
INSERT INTO users (name, email, password, phone_number) VALUES 
('Test User', 'test@example.com', '$2b$10$eCmEMs9TxpW0mKl6jGU08O3BwsF9vuX8GgQS7gN75.J2kvEX1Lzma', '1234567890');

-- Get the user_id for the test user
DO $$
DECLARE
    test_user_id INTEGER;
BEGIN
    SELECT user_id INTO test_user_id FROM users WHERE email = 'test@example.com';

    -- Sample assets for test user
    INSERT INTO assets (user_id, name, asset_type, current_value, acquisition_date, notes) VALUES
    (test_user_id, 'Savings Account', 'Cash', 10000.00, '2023-01-01', 'Main savings account'),
    (test_user_id, 'Investment Portfolio', 'Stock', 25000.00, '2022-06-15', 'Diversified portfolio'),
    (test_user_id, 'Property', 'Real Estate', 350000.00, '2020-03-10', 'Primary residence');

    -- Sample transactions for test user
    INSERT INTO transactions (user_id, amount, transaction_date, description, transaction_type, category_id, is_recurring) VALUES
    (test_user_id, 5000.00, '2023-03-01', 'Monthly salary', 'income', 1, TRUE),
    (test_user_id, 300.00, '2023-03-02', 'Dividend income', 'income', 2, FALSE),
    (test_user_id, 1200.00, '2023-03-03', 'Rent payment', 'expense', 2, TRUE),
    (test_user_id, 200.00, '2023-03-05', 'Groceries', 'expense', 1, FALSE),
    (test_user_id, 50.00, '2023-03-07', 'Gas', 'expense', 3, FALSE),
    (test_user_id, 100.00, '2023-03-10', 'Streaming services', 'expense', 7, TRUE),
    (test_user_id, 150.00, '2023-03-15', 'Restaurant dinner', 'expense', 5, FALSE);

    -- Sample budgets for test user
    INSERT INTO budgets (user_id, expense_category_id, amount, period, start_date, end_date) VALUES
    (test_user_id, 1, 800.00, 'monthly', '2023-03-01', '2023-12-31'),
    (test_user_id, 2, 1500.00, 'monthly', '2023-03-01', '2023-12-31'),
    (test_user_id, 3, 300.00, 'monthly', '2023-03-01', '2023-12-31'),
    (test_user_id, 5, 400.00, 'monthly', '2023-03-01', '2023-12-31'),
    (test_user_id, 7, 150.00, 'monthly', '2023-03-01', '2023-12-31');
END $$;