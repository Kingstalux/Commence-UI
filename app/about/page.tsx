import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav />
      <h1 className="text-3xl font-bold mb-8">About Us</h1>
      <div className="max-w-3xl mx-auto prose prose-gray">
        <p className="text-lg text-muted-foreground">
          Welcome to our production-grade e-commerce platform. We provide a comprehensive solution for online retail
          with advanced features like role-based authentication, real-time cart management, and powerful admin tools.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-3">For Customers</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Browse our extensive product catalog</li>
              <li>• Secure authentication and user profiles</li>
              <li>• Real-time shopping cart management</li>
              <li>• Streamlined checkout process</li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-3">For Administrators</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Comprehensive admin dashboard</li>
              <li>• Product and inventory management</li>
              <li>• Discount and promotion tools</li>
              <li>• Advanced analytics and reporting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
