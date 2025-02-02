"use server"
import { client } from "@/lib/prisma"
import { clerkClient, currentUser } from "@clerk/nextjs"
import { Domain } from "domain"

// Function to integrate a new domain into the user's account
export const onIntegrateDomain = async (domain: string, icon: string) => {
  const user = await currentUser() // Get the current logged-in user
  if (!user) return // If no user, exit the function
  try {
    // Check the user's subscription and domain count
    const subscription = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        _count: { // Count the number of domains the user has
          select: {
            domains: true,
          },
        },
        subscription: { // Get the user's subscription plan
          select: {
            plan: true,
          },
        },
      },
    })

    // Check if the domain already exists for the user
    const domainExists = await client.user.findFirst({
      where: {
        clerkId: user.id,
        domains: {
          some: { // Check if the domain name already exists
            name: domain,
          },
        },
      },
    })

    if (!domainExists) {
      // Check if the user can add more domains based on their subscription plan
      if (
        (subscription?.subscription?.plan == 'STANDARD' &&
          subscription._count.domains < 1) ||
        (subscription?.subscription?.plan == 'PRO' &&
          subscription._count.domains < 5) ||
        (subscription?.subscription?.plan == 'ULTIMATE' &&
          subscription._count.domains < 10)
      ) {
        // Add the new domain and create a chatbot
        const newDomain = await client.user.update({
          where: {
            clerkId: user.id,
          },
          data: {
            domains: {
              create: {
                name: domain,
                icon,
                chatBot: {
                  create: {
                    welcomeMessage: 'Hey there, have  a question? Text us here',
                  },
                },
              },
            },
          },
        })

        if (newDomain) {
          return { status: 200, message: 'Domain successfully added' }
        }
      }
      return {
        status: 400,
        message:
          "You've reached the maximum number of domains, upgrade your plan",
      }
    }
    return {
      status: 400,
      message: 'Domain already exists',
    }
  } catch (error) {
    console.log(error)
  }
}

// Function to get the current user's subscription plan
export const onGetSubscriptionPlan = async () => {
  try {
    const user = await currentUser() // Get the current logged-in user
    if (!user) return // If no user, exit the function
    const plan = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true, // Get the subscription plan of the user
          },
        },
      },
    })
    if (plan) {
      return plan.subscription?.plan // Return the subscription plan
    }
  } catch (error) {
    console.log(error)
  }
}

// Function to get all domains associated with the current user
export const onGetAllAccountDomains = async () => {
  const user = await currentUser() // Get the current logged-in user
  if (!user) return // If no user, exit the function
  try {
    const domains = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true, // Get user ID
        domains: {
          select: {
            name: true, // Get domain name
            icon: true, // Get domain icon
            id: true, // Get domain ID
            customer: { // Get customer details related to the domain
              select: {
                chatRoom: {
                  select: {
                    id: true, // Get chat room ID
                    live: true, // Check if the chat room is live
                  },
                },
              },
            },
          },
        },
      },
    })
    return { ...domains } // Return the domains and associated details
  } catch (error) {
    console.log(error)
  }
}
export const onUpdatePassword = async (password: string) => {
  try {
    const user = await currentUser();

    if (!user) return null;
    const update = await clerkClient.users.updateUser(user.id, { password });
    if (update) {
      return { status: 200, massage: "Password updated" };
    }
  } catch (error) {
    console.log(error);
  }
}

export const onGetCurrentDomainInfo = async (domain: string) => {
  const user = await currentUser()
  if (!user) return
  try {
    const userDomain = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        domains: {
          where: {
            name: {
              contains: domain,
            },
          },
          select: {
            id: true,
            name: true,
            icon: true,
            userId: true,
            products: true,
            chatBot: {
              select: {
                id: true,
                welcomeMessage: true,
                icon: true,
              },
            },
          },
        },
      },
    })
    if (userDomain) {
      return userDomain
    }
  } catch (error) {
    console.log(error)
  }
}

export const onUpdateDomain = async (id: string, name: string) => {
  try {
    //check if domain with name exists
    const domainExists = await client.domain.findFirst({
      where: {
        name: {
          contains: name,
        },
      },
    })

    if (!domainExists) {
      const domain = await client.domain.update({
        where: {
          id,
        },
        data: {
          name,
        },
      })

      if (domain) {
        return {
          status: 200,
          message: 'Domain updated',
        }
      }

      return {
        status: 400,
        message: 'Oops something went wrong!',
      }
    }

    return {
      status: 400,
      message: 'Domain with this name already exists',
    }
  } catch (error) {
    console.log(error)
  }
}

export const onChatBotImageUpdate = async (id: string, icon: string) => {
  const user = await currentUser()

  if (!user) return

  try {
    const domain = await client.domain.update({
      where: {
        id,
      },
      data: {
        chatBot: {
          update: {
            data: {
              icon,
            },
          },
        },
      },
    })

    if (domain) {
      return {
        status: 200,
        message: 'Domain updated',
      }
    }

    return {
      status: 400,
      message: 'Oops something went wrong!',
    }
  } catch (error) {
    console.log(error)
  }
}

export const onUpdateWelcomeMessage = async (
  message: string,
  domainId: string
) => {
  try {
    const update = await client.domain.update({
      where: {
        id: domainId,
      },
      data: {
        chatBot: {
          update: {
            data: {
              welcomeMessage: message,
            },
          },
        },
      },
    })

    if (update) {
      return { status: 200, message: 'Welcome message updated' }
    }
  } catch (error) {
    console.log(error)
  }
}

// Function to delete a user domain
export const onDeleteUserDomain = async (id: string) => {
  const user = await currentUser() // Get the current logged-in user
  if (!user) return { status: 400, message: "User not authenticated" } // If no user, return an error

  try {
    // Find the domain that belongs to the user and matches the domainId
    const validUser = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
      },
    })

    if (validUser) {
      const deletedDomain = await client.domain.delete({
        where: {
          userId: validUser.id,
          id,
        },
        select: {
          name: true,
        },
      })

      if (deletedDomain) {
        return {
          status: 200,
          message: `${deletedDomain.name} was deleted successfully`,
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}

export const onCreateHelpDeskQuestion = async (
  id: string,
  question: string,
  answer: string
) => {
  try {
    const helpDeskQuestion = await client.domain.update({
      where: {
        id,
      },
      data: {
        helpdesk: {
          create: {
            question,
            answer,
          },
        },
      },
      include: {
        helpdesk: {
          select: {
            id: true,
            question: true,
            answer: true,
          },
        },
      },
    })

    if (helpDeskQuestion) {
      return {
        status: 200,
        message: 'New help desk question added',
        questions: helpDeskQuestion.helpdesk,
      }
    }

    return {
      status: 400,
      message: 'Oops! something went wrong',
    }
  } catch (error) {
    console.log(error)
  }
}

export const onGetAllHelpDeskQuestions = async (id: string) => {
  try {
    const questions = await client.helpDesk.findMany({
      where: {
        domainId: id,
      },
      select: {
        question: true,
        answer: true,
        id: true,
      },
    })
    return {
      status: 200,
      message: 'New help desk question added',
      questions: questions,
    }
  } catch (error) {
    console.log(error)
  }
}

export const onCreateFilterQuestions = async (id: string, question: string) => {
  try {
    const filterQuestion = await client.domain.update({
      where: {
        id,
      },
      data: {
        filterQuestions: {
          create: {
            question,
          },
        },
      },
      include: {
        filterQuestions: {
          select: {
            id: true,
            question: true,
          },
        },
      },
    })

    if (filterQuestion) {
      return {
        status: 200,
        message: 'Filter question added',
        questions: filterQuestion.filterQuestions,
      }
    }
    return {
      status: 400,
      message: 'Oops! something went wrong',
    }
  } catch (error) {
    console.log(error)
  }
}

// Function to fetch all filtered questions for a specific domain based on the domainId
export const onGetAllFilterQuestions = async (id: string) => {
  console.log(id) // Log the domainId to verify it was received correctly

  try {
    // Query the database to find all questions associated with the domainId
    const questions = await client.filterQuestions.findMany({
      where: {
        domainId: id, // Filter by domainId
      },
      select: {
        question: true, // Select the question text
        id: true, // Select the question ID
      },
      orderBy: {
        question: 'asc', // Order questions alphabetically
      },
    })

    // Return the status and the fetched questions
    return {
      status: 200,
      message: '',
      questions: questions,
    }
  } catch (error) {
    console.log(error) // Log any errors that occur during the query
  }
}
