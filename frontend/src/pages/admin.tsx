import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import Loader from 'react-loader-spinner'

import AdminComponent from '../components/Admin'
import { AuthContext } from '../context/AuthContextProvider'
import { isAdmin } from '../helpers/authHelpers'

export default function Admin() {
  const { loggedInUser } = useContext(AuthContext)

  const router = useRouter()

  useEffect(() => {
    // If user in not authenticated, push to home page
    if (!loggedInUser) {
      router.push('/')
    } else {
      if (!isAdmin(loggedInUser)) {
        // Push user to their dashboard
        router.push('/dashboard')
        alert('No Authorization.')
      }
    }
  }, [loggedInUser])

  return !isAdmin(loggedInUser) ? (
    <Loader type='Oval' color='teal' height={30} width={30} timeout={30000} />
  ) : (
    <AdminComponent admin={loggedInUser} />
  )
}
