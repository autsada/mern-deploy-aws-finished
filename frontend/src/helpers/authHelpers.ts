import { User } from '../types'

export const isAdmin = (user: User | null) =>
  !user
    ? false
    : user.roles.includes('ADMIN') || user.roles.includes('SUPERADMIN')

export const isSuperAdmin = (user: User | null) =>
  !user ? false : user.roles.includes('SUPERADMIN')

export const isClient = (user: User | null) =>
  !user
    ? false
    : !user.roles.includes('ADMIN') ||
      !user.roles.includes('SUPERADMIN') ||
      !user.roles.includes('ITEMEDITOR')
