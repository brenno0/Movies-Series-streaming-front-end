/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useCreateUser } from '@/gen'

export const Route = createFileRoute('/auth/sign-up/')({
  component: SignUp,
})

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })

  const navigate = useNavigate()
  const { mutateAsync: createUser, isPending: isLoading } = useCreateUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await createUser({ data: formData })
      navigate({ to: '/auth/sign-in' })
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao criar conta')
    }
  }

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-chart-1/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-[480px] flex flex-col items-center justify-center relative z-10">
        <div className="w-full backdrop-blur-xl bg-card/40 border border-border/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden group hover:bg-card/50 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="logo text-5xl font-bold text-foreground mb-2 tracking-wider">
                NBFLIX
              </h1>
              <p className="text-muted-foreground text-sm">Criar nova conta</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                  <User className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  className="pl-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary focus:ring-primary/20 transition-all duration-300 hover:bg-background/70"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="pl-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary focus:ring-primary/20 transition-all duration-300 hover:bg-background/70"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Crie sua senha (mín. 6 caracteres)"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className="pl-12 pr-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary focus:ring-primary/20 transition-all duration-300 hover:bg-background/70"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-primary transition-colors z-10"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 group relative overflow-hidden mt-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-chart-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      <span>Criando conta...</span>
                    </>
                  ) : (
                    <>
                      <span>Criar conta</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Já tem uma conta?{' '}
              <a
                href="/auth/sign-in"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Entrar
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
