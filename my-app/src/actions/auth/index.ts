'use server'

import { client } from '@/lib/prisma'
import { currentUser, redirectToSignIn } from '@clerk/nextjs'
import { onGetAllAccountDomains } from '../settings'

// Function to complete user registration
export const onCompleteUserRegistration = async (
  fullname: string, // User's full name
  clerkId: string,  // Clerk's unique ID for the user
  type: string      // User type (e.g., admin, regular user)
) => {
  try {
    // Create a new user in the database
    const registered = await client.user.create({
      data: {
        fullname,  // Assign the provided fullname
        clerkId,   // Assign the provided clerkId
        type,      // Assign the provided type
        subscription: {
          create: {}, // Create an empty subscription entry for the new user
        },
      },
      select: {
        fullname: true, // Return the user's fullname
        id: true,       // Return the user's unique ID in the database
        type: true,     // Return the user's type
      },
    })

    if (registered) {
      return { status: 200, user: registered } // Return success status and user data
    }
  } catch (error) {
    return { status: 400 } // Return error status if something goes wrong
  }
}

// Function to log in the user
export const onLoginUser = async () => {
  const user = await currentUser() // Get the current user from Clerk
  if (!user) redirectToSignIn() // Redirect to sign-in if no user is logged in
  else {
    try {
      // Find the user in the database by their Clerk ID
      const authenticated = await client.user.findUnique({
        where: {
          clerkId: user.id, // Match the user by their Clerk ID
        },
        select: {
          fullname: true, // Return the user's fullname
          id: true,       // Return the user's unique ID in the database
          type: true,     // Return the user's type
        },
      })
      if (authenticated) {
        const domains = await onGetAllAccountDomains() // Get all account domains for the user
        return { status: 200, user: authenticated, domain: domains?.domains } // Return success status, user data, and domains
      }
    } catch (error) {
      return { status: 400 } // Return error status if something goes wrong
    }
  }
}
