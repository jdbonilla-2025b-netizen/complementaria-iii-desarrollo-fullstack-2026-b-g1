import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Login from './Login'
import * as api from '../api'

vi.mock('../api')

describe('Login', () => {
  beforeEach(() => vi.resetAllMocks())

  it('envía las credenciales y entrega el token (camino feliz)', async () => {
    api.login.mockResolvedValue('tok123')
    const onLogin = vi.fn()
    render(<Login onLogin={onLogin} />)
    await userEvent.type(screen.getByLabelText(/usuario/i), 'admin')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'admin123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(api.login).toHaveBeenCalledWith('admin', 'admin123')
    expect(onLogin).toHaveBeenCalledWith('tok123')
  })

  it('muestra error si las credenciales son incorrectas (caso de error)', async () => {
    api.login.mockRejectedValue(new Error('Usuario o contraseña incorrectos'))
    const onLogin = vi.fn()
    render(<Login onLogin={onLogin} />)
    await userEvent.type(screen.getByLabelText(/usuario/i), 'admin')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'mala')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('incorrectos')
    expect(onLogin).not.toHaveBeenCalled()
  })

  it('no llama a la API con campos vacíos (caso límite)', async () => {
    render(<Login onLogin={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/ingresa usuario/i)
    expect(api.login).not.toHaveBeenCalled()
  })
})
