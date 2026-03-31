/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuthUser } from '@/gen'

export const Route = createFileRoute('/auth/sign-in/')({
  component: SignIn,
})

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { mutateAsync: authUser, isPending: isLoading } = useAuthUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(e)
    try {
      const { email = '', password = '' } = formData
      await authUser({ data: { email, password } })
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))
    }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-chart-1/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-chart-2/20 rounded-full blur-2xl animate-bounce delay-500"></div>
      </div>

      <div className="w-[480px] flex flex-col items-center justify-center relative z-10">
        {/* Glass Container */}
        <div className="w-full backdrop-blur-xl bg-card/40 border border-border/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden group hover:bg-card/50 transition-all duration-500">
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <h1 className="logo text-5xl font-bold text-foreground mb-2 tracking-wider">
                NBFLIX
              </h1>
              <p className="text-muted-foreground text-sm">
                Entre na sua conta
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
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

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className="pl-12 pr-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary focus:ring-primary/20 transition-all duration-300 hover:bg-background/70"
                  required
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

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary bg-transparent border-border/50 rounded focus:ring-primary/20 focus:ring-2"
                  />
                  <span className="text-muted-foreground">Lembrar de mim</span>
                </label>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Esqueci a senha
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-chart-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      <span>Entrando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-border/50"></div>
              <span className="px-4 text-muted-foreground text-sm">ou</span>
              <div className="flex-1 border-t border-border/50"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-11 rounded-xl border-border/50 bg-background/30 backdrop-blur-sm hover:bg-background/50 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Não tem uma conta?{' '}
              <a
                href="/auth/sign-up"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Criar conta
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
