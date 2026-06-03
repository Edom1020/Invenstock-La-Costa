# Guía de Validación de Contraseñas para el Backend

Para garantizar la seguridad del sistema Invenstock, el backend debe validar que las contraseñas de los usuarios cumplan con los mismos criterios definidos en el frontend antes de almacenarlas.

## Requisitos de la Contraseña

1. **Longitud mínima:** 12 caracteres.
2. **Mayúsculas:** Al menos una letra mayúscula (A-Z).
3. **Números:** Al menos un dígito (0-9).
4. **Caracteres especiales:** Al menos un símbolo de la siguiente lista: `!@#$%^&*`

## Implementación Sugerida (Regex)

Se recomienda utilizar la siguiente expresión regular para la validación:

```regex
/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/
```

### Ejemplo en Node.js (con Joi)

```javascript
const schema = Joi.object({
  password: Joi.string()
    .min(12)
    .regex(/[A-Z]/, "debe contener al menos una mayúscula")
    .regex(/[0-9]/, "debe contener al menos un número")
    .regex(/[!@#$%^&*]/, "debe contener al menos un caracter especial")
    .required(),
});
```

### Ejemplo en Python (con Pydantic)

```python
import re
from pydantic import validator

def validate_password(password: str):
    if not re.match(r'^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$', password):
        raise ValueError('La contraseña no cumple con los requisitos mínimos de seguridad.')
```

**Nota Importante:** Recuerden que las contraseñas deben ser hasheadas con algoritmos seguros como **BCrypt** o **Argon2** antes de guardarse en la base de datos.
