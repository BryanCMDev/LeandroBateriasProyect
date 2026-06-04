-- =====================================================================================
-- E-COMMERCE DATABASE SCHEMA AVANZADO (SUPABASE / POSTGRESQL)
-- Proyecto: Leandro Baterías (Escalable y Relacional)
-- =====================================================================================

-- 1. TABLA DE USUARIOS / CLIENTES (Opcional, para clientes registrados)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    document_type TEXT, -- DNI, RUC, CE
    document_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA DE CATEGORÍAS
-- Para agrupar las baterías (Ej: Autos, Motos, Solares, etc.)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE PRODUCTOS (Inventario Central)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL, -- Código único
    brand TEXT NOT NULL,      -- Marca (Bosch, Etna)
    model TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    stock INTEGER NOT NULL DEFAULT 0,
    amperage TEXT,            -- Capacidad
    voltage TEXT NOT NULL,    -- Voltaje
    "imageUrl" TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA DEL CARRITO DE COMPRAS (Sesiones Activas)
-- Mantiene el carrito guardado si el cliente cierra la página
CREATE TABLE IF NOT EXISTS public.shopping_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE, -- Null si es usuario invitado
    session_id TEXT UNIQUE, -- Identificador de sesión para usuarios no logueados
    status TEXT DEFAULT 'active', -- 'active', 'converted_to_order', 'abandoned'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA DE DETALLES DEL CARRITO (Items dentro del carrito)
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES public.shopping_carts(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cart_id, product_id) -- Un mismo producto no debe repetirse, se suma la cantidad
);

-- 6. TABLA DE ÓRDENES / FACTURACIÓN (Cabecera del Pedido / Factura)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- Ej: 'ORD-2023-0001'
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    date TEXT NOT NULL,
    "customerName" TEXT NOT NULL,     -- Nombre o Razón Social al momento de compra
    "documentId" TEXT NOT NULL,       -- DNI o RUC
    "receiptType" TEXT NOT NULL,      -- 'boleta', 'factura', 'ticket'
    email TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    shipping_address TEXT,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    taxes NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pendiente', -- 'Pendiente', 'Pagado', 'Enviado', 'Cancelado'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLA DE DETALLES DE COMPRA (Order Items)
-- Fundamental: Guarda el precio histórico. Si el producto sube de precio mañana, tu factura pasada no cambia.
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL, -- Guardamos el nombre exacto por si luego cambia
    product_sku TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL, -- Precio fotocopiado en el momento de la venta
    subtotal_price NUMERIC(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABLA DE PAGOS Y TRANSACCIONES
-- Permite tener múltiples intentos de pago, auditoría de Yape, transferencias, etc.
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    "paymentMethod" TEXT NOT NULL, -- 'yape', 'plin', 'tarjeta', 'efectivo', 'transferencia'
    transaction_reference TEXT,    -- Número de operación de Yape/Banco
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pendiente', -- 'Pendiente', 'Aprobado', 'Rechazado'
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PERMISOS (Row Level Security - RLS)
-- Para desarrollo apagaremos la seguridad, pero en producción deberás activarla.
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_carts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;

