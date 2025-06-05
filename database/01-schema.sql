-- ENUM types
CREATE TYPE dish_type AS ENUM ('Appetizer', 'Main', 'Dessert', 'Beverage');
CREATE TYPE category AS ENUM ('Salads', 'Pasta', 'Grill', 'Soup', 'Seafood');
CREATE TYPE unit_measure AS ENUM ('g', 'kg', 'ml', 'l', 'unit');
CREATE TYPE order_status AS ENUM ('Pending', 'Delivered', 'Cancelled');
CREATE TYPE shift_status AS ENUM ('Scheduled', 'Completed', 'Absent');

-- Tables
CREATE TABLE dishes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  type dish_type NOT NULL,
  category category NOT NULL,
  preparation_minutes INT CHECK (preparation_minutes >= 0),
  base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0)
);

CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(8) NOT NULL CHECK (phone ~ '^\d{8}$'),
  address VARCHAR(200) NOT NULL
);

CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  unit_measure unit_measure NOT NULL,
  id_supplier INT NOT NULL REFERENCES suppliers(id)
);

CREATE TABLE dish_ingredients (
  id SERIAL PRIMARY KEY,
  id_ingredient INT NOT NULL REFERENCES ingredients(id),
  id_dish INT NOT NULL REFERENCES dishes(id),
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  id_supplier INT NOT NULL REFERENCES suppliers(id),
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status order_status NOT NULL DEFAULT 'Pending',
  total DECIMAL(10,2) DEFAULT 0.00
);

CREATE TABLE order_details (
  id SERIAL PRIMARY KEY,
  id_order INT NOT NULL REFERENCES orders(id),
  id_ingredient INT NOT NULL REFERENCES ingredients(id),
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0)
);

CREATE TABLE staff_roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  id_role INT NOT NULL REFERENCES staff_roles(id),
  phone VARCHAR(8) NOT NULL CHECK (phone ~ '^\d{8}$'),
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE branches (
  id SERIAL PRIMARY KEY,
  location VARCHAR(250) NOT NULL,
  opening_time TIME NOT NULL,
  closing_time TIME NOT NULL,
  phone VARCHAR(8) NOT NULL CHECK (phone ~ '^\d{8}$'),
  email VARCHAR(250) NOT NULL CHECK (email ~* E'^[^@]+@[^@]+\\.[^@]+$'),
  CHECK (closing_time > opening_time)
);

CREATE TABLE shift_records (
  id SERIAL PRIMARY KEY,
  id_employee INT NOT NULL REFERENCES staff(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_hours INTERVAL,
  id_branch INT NOT NULL REFERENCES branches(id),
  status shift_status DEFAULT 'Scheduled',
  comment TEXT,
  CHECK (end_time > start_time)
);

CREATE TABLE branch_menus (
  id SERIAL PRIMARY KEY,
  id_branch INT NOT NULL REFERENCES branches(id),
  id_dish INT NOT NULL REFERENCES dishes(id),
  current_price DECIMAL(10,2) NOT NULL CHECK (current_price >= 0)
);

CREATE TABLE tables (
  id SERIAL PRIMARY KEY,
  id_branch INT NOT NULL REFERENCES branches(id),
  table_number INT NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0)
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  phone VARCHAR(8) NOT NULL CHECK (phone ~ '^\d{8}$'),
  email VARCHAR(250) NOT NULL CHECK (email ~* E'^[^@]+@[^@]+\\.[^@]+$')
);

CREATE TABLE table_customers (
  id SERIAL PRIMARY KEY,
  id_customer INT NOT NULL REFERENCES customers(id),
  id_waiter_shift INT NOT NULL REFERENCES shift_records(id),
  arrival_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  departure_time TIMESTAMP
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  id_customer INT NOT NULL REFERENCES customers(id),
  invoice_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE invoice_details (
  id SERIAL PRIMARY KEY,
  id_invoice INT NOT NULL REFERENCES invoices(id),
  id_dish INT NOT NULL REFERENCES dishes(id),
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  subtotal DECIMAL(10,2) DEFAULT 0
);


-- Functions and Triggers
-- 1. Calculate the hours worked based on the entry and exit times
CREATE OR REPLACE FUNCTION calc_total_hours()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_hours := NEW.end_time - NEW.start_time;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_total_hours
BEFORE INSERT OR UPDATE ON shift_records
FOR EACH ROW
EXECUTE FUNCTION calc_total_hours();

-- 2. Update an order total by modifying the order_details
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE orders
  SET total = COALESCE((
    SELECT SUM(quantity * price)
    FROM order_details
    WHERE id_order = NEW.id_order
  ), 0)
  WHERE id = NEW.id_order;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_details_insert
AFTER INSERT ON order_details
FOR EACH ROW EXECUTE FUNCTION update_order_total();

CREATE TRIGGER trg_order_details_update
AFTER UPDATE ON order_details
FOR EACH ROW EXECUTE FUNCTION update_order_total();

CREATE TRIGGER trg_order_details_delete
AFTER DELETE ON order_details
FOR EACH ROW
EXECUTE FUNCTION update_order_total();

-- 3. Calculate the invoice_details subtotal based on the quantity and unit price
CREATE OR REPLACE FUNCTION calc_invoice_detail_subtotal()
RETURNS TRIGGER AS $$
BEGIN
  NEW.subtotal := NEW.quantity * NEW.unit_price;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_invoice_detail_subtotal
BEFORE INSERT OR UPDATE ON invoice_details
FOR EACH ROW
EXECUTE FUNCTION calc_invoice_detail_subtotal();


-- 4. Calculate the total invoices based on your invoice_details
CREATE OR REPLACE FUNCTION update_invoice_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invoices
  SET total = COALESCE((
    SELECT SUM(subtotal)
    FROM invoice_details
    WHERE id_invoice = NEW.id_invoice
  ), 0)
  WHERE id = NEW.id_invoice;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_details_insert
AFTER INSERT ON invoice_details
FOR EACH ROW EXECUTE FUNCTION update_invoice_total();

CREATE TRIGGER trg_invoice_details_update
AFTER UPDATE ON invoice_details
FOR EACH ROW EXECUTE FUNCTION update_invoice_total();

CREATE TRIGGER trg_invoice_details_delete
AFTER DELETE ON invoice_details
FOR EACH ROW EXECUTE FUNCTION update_invoice_total();

--VIEWS
CREATE VIEW dishesBranchInfo AS
SELECT d.id, d.name, d.description, d.type, d.category, d.preparation_minutes, d.base_price, bm.current_price, b.location, di.quantity, i.name as ingredient, i.unit_measure
FROM dishes d 
JOIN branch_menus bm ON bm.id_dish = d.id
JOIN branches b ON bm.id_branch = b.id
JOIN dish_ingredients di ON di.id_dish = d.id
JOIN ingredients i ON di.id_ingredient = i.id;

CREATE VIEW staffInfo AS
SELECT s.name, s.phone, sr.name as rol, sh.date, sh.start_time, sh.end_time, sh.status, sh.comment, b.location 
FROM shift_records sh 
JOIN staff s ON sh.id_employee = s.id
JOIN staff_roles sr ON s.id_role = sr.id
JOIN branches b ON sh.id_branch = b.id;
