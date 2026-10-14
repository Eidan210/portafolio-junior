# Envío automático del formulario (Google Apps Script)

Con este script, el formulario de contacto envía el mensaje directo a tu Gmail, sin servicios de terceros y sin que el visitante necesite tener Gmail. Mientras no esté desplegado, el formulario usa el plan B: abre Gmail con el mensaje ya escrito.

## Desplegarlo (una vez, unos 5 minutos)

1. Entra en [script.google.com](https://script.google.com) con la cuenta donde quieres **recibir** los mensajes (`eidanalexander210@gmail.com`) y pulsa **Nuevo proyecto**.
2. Borra el contenido de `Código.gs` y pega el de [`contacto.gs`](contacto.gs). Ponle un nombre al proyecto, por ejemplo "Contacto portafolio", y guarda.
3. **Implementar → Nueva implementación**. En el engranaje de "Seleccionar tipo", elige **Aplicación web** y configura:
   - **Ejecutar como:** Yo (tu correo).
   - **Quién tiene acceso:** Cualquier usuario.
4. Pulsa **Implementar** y autoriza los permisos: **Revisar permisos → Configuración avanzada → Ir a "Contacto portafolio" → Permitir**. Google avisa porque el script es tuyo y no está verificado: es normal.
5. Copia la **URL de la aplicación web**, que acaba en `/exec`. Si la abres en el navegador, debe mostrar `{"ok":true,"service":"contacto"}`.
6. Pega esa URL en `contactEndpoint`, dentro de `src/data/profile.ts`, y publica el sitio.

## Si cambias el script

Guardar no actualiza la URL `/exec`. Ve a **Implementar → Administrar implementaciones**, edita la implementación activa (icono del lápiz), elige **Versión: Nueva versión** e implementa. La URL no cambia.

## Límites

- **Cuota:** Gmail gratuito permite 100 destinatarios al día con MailApp. Si se agota, el formulario lo detecta y ofrece Gmail como plan B.
- **Antiabuso:**
  - honeypot (campo oculto que solo rellenan los bots);
  - validación y topes de longitud en el servidor;
  - como mucho 8 mensajes cada 10 minutos.
