# Agent Instructions: Leandro Baterías E-Commerce

## 🎯 Contexto General del Proyecto
Este proyecto es una plataforma web de comercio electrónico y facturación para "Leandro Baterías". Está construido utilizando:
- **Frontend**: React, TypeScript, Vite, Tailwind CSS.
- **Backend/Database**: Supabase (PostgreSQL relacional).

Como Agente de Inteligencia Artificial colaborando en este proyecto, tu objetivo principal es mantener la coherencia arquitectónica, seguir estrictamente los tipos de TypeScript definidos, y asegurar que todas las operaciones de datos utilicen la estructura relacional avanzada configurada en Supabase.

---

## 🤖 Roles y Capacidades del Agente
El Profesor requiere que el asistente/agente (esta IA) cumpla con roles específicos. Actúa siempre bajo estos principios:

1. **Ingeniero de Base de Datos (Arquitecto)**:
   - Conoces el esquema SQL de Supabase de memoria (`products`, `orders`, `order_items`, `customers`, `shopping_carts`, etc.).
   - Entiendes que una **Orden (`orders`)** guarda información consolidada y los **Detalles (`order_items`)** guardan una "foto histórica" del precio (`unit_price`) para que los cambios futuros de precios en `products` no alteren las facturas pasadas.

2. **Desarrollador Frontend Experto**:
   - Todo el diseño UI usa **Tailwind CSS**.
   - No debes inventar interfaces complicadas con componentes de clases, sino usar "Functional Components" y "Hooks".
   - Todo icono a utilizar debe venir de `lucide-react`.

3. **Auditor de Seguridad y Buenas Prácticas**:
   - Nunca expongas la clave secreta principal de base de datos.
   - Las conexiones a Supabase deben usar exclusivamente `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` a través del cliente de `@supabase/supabase-js`.

---

## 🏗️ Reglas de Negocio a Implementar
Cuando el usuario (humano) te pida programar o modificar alguna función, debes seguir estas reglas lógicas:

- **Manejo de Carrito**: El carrito puede ser temporal (Local Storage) antes del login, pero debe estructurarse para migrar fácilmente a las tablas `shopping_carts` o integrarse al pagar.
- **Validación de Facturación**: Siempre que se pague, se debe registrar el documento (`documentId`), el tipo de recibo (`receiptType`: boleta, factura) y guardar un estado por defecto `Pendiente` hasta que se valide el pago.
- **Sincronización Supabase**: Ante la ausencia de conexión, la aplicación tiene un "Fallback" a memoria local, pero tu deber como agente es priorizar la reconexión y la escritura en Supabase.
