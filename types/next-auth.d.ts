import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: 'ADMIN' | 'SELLER' | 'CUSTOMER'
    }
  }

  interface User {
    role: 'ADMIN' | 'SELLER' | 'CUSTOMER'
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: 'ADMIN' | 'SELLER' | 'CUSTOMER'
  }
}
