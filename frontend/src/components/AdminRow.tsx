import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from 'react-loader-spinner'

import { User, Role } from '../types'
import { isSuperAdmin } from '../helpers/authHelpers'
import { UPDATE_ROLES, DELETE_USER } from '../apollo/mutations'
import { QUERY_USERS } from '../apollo/queries'

interface Props {
  user: User
  admin: User | null
}

const DeleteBtn = styled.button`
  background: red;
  color: white;

  &:hover {
    background: orange;
  }
`

const AdminRow: React.FC<Props> = ({ user, admin }) => {
  const { roles } = user
  const initialState = {
    CLIENT: roles.includes('CLIENT'),
    ITEMEDITOR: roles.includes('ITEMEDITOR'),
    ADMIN: roles.includes('ADMIN'),
  }

  const [isEditing, setIsEditing] = useState(false)
  const [roleState, setRoleState] = useState(initialState)

  const [updateRoles, { loading, error }] = useMutation<
    { updateRoles: User },
    { userId: string; newRoles: Role[] }
  >(UPDATE_ROLES)

  useEffect(() => {
    if (error)
      alert(error.graphQLErrors[0]?.message || 'Sorry, something went wrong')
  }, [error])

  const handleSubmitUpdateRoles = async (userId: string) => {
    try {
      const newRoles: Role[] = []

      Object.entries(roleState).forEach(([k, v]) =>
        v ? newRoles.push(k as Role) : null
      ) // {ITEMEDITOR: true, ADMIN: false} --> [[ITEMEDITOR, true], [ADMIN, false]]

      // Check if the user.roles array has not been changed --> do not call to backend
      if (user.roles.length === newRoles.length) {
        const checkRoles = user.roles.map((role) => newRoles.includes(role))

        if (!checkRoles.includes(false)) {
          alert('Nothing change')
          return
        }
      }

      const response = await updateRoles({
        variables: { userId, newRoles },
        refetchQueries: [{ query: QUERY_USERS }],
      })

      if (response.data?.updateRoles) {
        setIsEditing(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const [deleteUser, deleteUserRes] = useMutation<
    { deleteUser: { message: string } },
    { userId: string }
  >(DELETE_USER)

  useEffect(() => {
    if (deleteUserRes.error)
      alert(deleteUserRes.error.graphQLErrors[0]?.message)
  }, [deleteUserRes.error])

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await deleteUser({
        variables: { userId },
        refetchQueries: [{ query: QUERY_USERS }],
      })

      if (res.data?.deleteUser.message) {
        alert(res.data?.deleteUser.message)
      }
    } catch (error) {
      alert((error as Error).message)
    }
  }

  return (
    <tr key={user.id}>
      {/* Name */}
      <td>{user.username}</td>

      {/* Email */}
      <td>{user.email}</td>

      {/* CreatedAt */}
      <td>{user.createdAt}</td>

      {/* Manage Roles Section */}
      {/* client role */}
      {isSuperAdmin(admin) && (
        <>
          <td
            style={{
              background: !isEditing ? 'white' : undefined,
              cursor: isEditing ? 'pointer' : undefined,
            }}
            className='td_role'
          >
            <FontAwesomeIcon
              icon={['fas', 'check-circle']}
              className='true'
              size='lg'
              style={{ color: 'black', cursor: 'not-allowed' }}
            />
          </td>

          {/* item editor role */}
          <td
            style={{
              background: !isEditing ? 'white' : undefined,
              cursor: isEditing ? 'pointer' : undefined,
            }}
            className='td_role'
            onClick={
              isEditing
                ? () =>
                    setRoleState((prev) => ({
                      ...prev,
                      ITEMEDITOR: !prev.ITEMEDITOR,
                    }))
                : undefined
            }
          >
            {roleState.ITEMEDITOR ? (
              <FontAwesomeIcon
                icon={['fas', 'check-circle']}
                className='true'
                size='lg'
                style={{ color: !isEditing ? 'black' : undefined }}
              />
            ) : (
              <FontAwesomeIcon
                icon={['fas', 'times-circle']}
                className='false'
                size='lg'
                style={{ color: !isEditing ? 'lightgray' : undefined }}
              />
            )}
          </td>

          {/* admin role */}
          <td
            style={{
              background: !isEditing ? 'white' : undefined,
              cursor: isEditing ? 'pointer' : undefined,
            }}
            className='td_role'
            onClick={
              isEditing
                ? () =>
                    setRoleState((prev) => ({ ...prev, ADMIN: !prev.ADMIN }))
                : undefined
            }
          >
            <>
              {roleState.ADMIN ? (
                <FontAwesomeIcon
                  icon={['fas', 'check-circle']}
                  className='true'
                  size='lg'
                  style={{ color: !isEditing ? 'black' : undefined }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={['fas', 'times-circle']}
                  className='false'
                  size='lg'
                  style={{ color: !isEditing ? 'lightgray' : undefined }}
                />
              )}
            </>
          </td>

          {/* super admin role */}
          <td>
            {isSuperAdmin(user) && (
              <FontAwesomeIcon
                style={{ cursor: 'not-allowed' }}
                icon={['fas', 'check-circle']}
                size='lg'
              />
            )}
          </td>

          {/* action */}
          {loading ? (
            <td>
              <Loader
                type='Oval'
                color='teal'
                width={30}
                height={30}
                timeout={30000}
              />
            </td>
          ) : isEditing ? (
            <td>
              <p className='role_action'>
                <button>
                  <FontAwesomeIcon
                    icon={['fas', 'times']}
                    color='red'
                    onClick={() => {
                      setRoleState(initialState)
                      setIsEditing(false)
                    }}
                    size='lg'
                  />
                </button>
                <button onClick={() => handleSubmitUpdateRoles(user.id)}>
                  <FontAwesomeIcon
                    icon={['fas', 'check']}
                    color='teal'
                    size='lg'
                  />
                </button>
              </p>
            </td>
          ) : (
            <td>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </td>
          )}

          <td>
            {isSuperAdmin(user) ? null : (
              <DeleteBtn
                style={{ cursor: isEditing ? 'not-allowed' : undefined }}
                disabled={isEditing}
                onClick={() => {
                  if (!confirm('Are you sure to delete this user?')) return

                  handleDeleteUser(user.id)
                }}
              >
                {deleteUserRes.loading ? (
                  <Loader
                    type='Oval'
                    color='teal'
                    width={30}
                    height={30}
                    timeout={30000}
                  />
                ) : (
                  <FontAwesomeIcon icon={['fas', 'trash-alt']} size='lg' />
                )}
              </DeleteBtn>
            )}
          </td>
        </>
      )}
    </tr>
  )
}

export default AdminRow
