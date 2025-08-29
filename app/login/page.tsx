import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Shield } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <LoginForm />

        <Card className="border-dashed border-muted-foreground/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Demo Credentials</CardTitle>
            <CardDescription className="text-xs">Use these credentials to test the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <div className="flex items-center space-x-2">
                <User className="h-3 w-3 text-blue-600" />
                <div className="text-xs">
                  <div className="font-medium">Regular User</div>
                  <div className="text-muted-foreground">user@test.com</div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                password123
              </Badge>
            </div>

            <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3 text-red-600" />
                <div className="text-xs">
                  <div className="font-medium">Admin User</div>
                  <div className="text-muted-foreground">admin@test.com</div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                admin123
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
