import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Toaster } from '../ui/sonner'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [actionHistory, setActionHistory] = useState([])

  // Load action history from localStorage on mount
  useEffect(() => {
    const savedActions = localStorage.getItem('actionHistory')
    if (savedActions) {
      try {
        setActionHistory(JSON.parse(savedActions))
      } catch (error) {
        console.error('Failed to parse action history:', error)
      }
    }
  }, [])

  // Save action history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('actionHistory', JSON.stringify(actionHistory))
  }, [actionHistory])

  const addNotification = (message, type = 'info', duration = 5000, actionId = null) => {
    const id = Date.now()
    const notification = {
      id,
      message,
      type,
      duration,
      actionId,
      timestamp: new Date().toISOString()
    }

    setNotifications(prev => [...prev, notification])

    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const clearAllActions = () => {
    setActionHistory([])
  }

  const markActionAsRead = (actionId) => {
    setActionHistory(prev => 
      prev.map(action => 
        action.id === actionId ? { ...action, read: true } : action
      )
    )
  }

  // Enhanced action tracking with better categorization
  const trackAction = (actionType, additionalData = {}) => {
    const actionId = Date.now().toString()
    const timestamp = new Date().toISOString()
    
    let action = {
      id: actionId,
      type: actionType,
      timestamp,
      read: false,
      ...additionalData
    }

    // Categorize actions based on type with more specific descriptions
    switch (actionType) {
      case 'job_apply':
        action = {
          ...action,
          category: 'application',
          icon: '📝',
          title: 'Job Application Submitted',
          description: additionalData.jobTitle && additionalData.companyName 
            ? `Applied for ${additionalData.jobTitle} at ${additionalData.companyName}`
            : additionalData.jobTitle 
            ? `Applied for ${additionalData.jobTitle}`
            : 'Job application submitted successfully'
        }
        break
      case 'job_create':
        action = {
          ...action,
          category: 'admin',
          icon: '💼',
          title: 'Job Posted Successfully',
          description: additionalData.jobTitle 
            ? `Posted new job: ${additionalData.jobTitle}`
            : 'New job posted successfully'
        }
        break
      case 'job_delete':
        action = {
          ...action,
          category: 'admin',
          icon: '🗑️',
          title: 'Job Deleted',
          description: additionalData.jobTitle 
            ? `Deleted job: ${additionalData.jobTitle}`
            : 'Job deleted successfully'
        }
        break
      case 'job_update':
        action = {
          ...action,
          category: 'admin',
          icon: '✏️',
          title: 'Job Updated',
          description: additionalData.jobTitle 
            ? `Updated job: ${additionalData.jobTitle}`
            : 'Job updated successfully'
        }
        break
      case 'profile_update':
        action = {
          ...action,
          category: 'profile',
          icon: '👤',
          title: 'Profile Updated',
          description: additionalData.field 
            ? `Updated ${additionalData.field} in your profile`
            : 'Your profile has been updated successfully'
        }
        break
      case 'role_switch':
        action = {
          ...action,
          category: 'profile',
          icon: '🔄',
          title: 'Role Switched',
          description: additionalData.newRole 
            ? `Switched to ${additionalData.newRole} role`
            : 'Role switched successfully'
        }
        break
      case 'company_create':
        action = {
          ...action,
          category: 'admin',
          icon: '🏢',
          title: 'Company Created',
          description: additionalData.companyName 
            ? `Created new company: ${additionalData.companyName}`
            : 'New company created successfully'
        }
        break
      case 'company_update':
        action = {
          ...action,
          category: 'admin',
          icon: '🏢',
          title: 'Company Updated',
          description: additionalData.companyName 
            ? `Updated company: ${additionalData.companyName}`
            : 'Company updated successfully'
        }
        break
      case 'login':
        action = {
          ...action,
          category: 'auth',
          icon: '🔐',
          title: 'Login Successful',
          description: additionalData.email 
            ? `Successfully logged in as ${additionalData.email}`
            : 'Successfully logged into your account'
        }
        break
      case 'logout':
        action = {
          ...action,
          category: 'auth',
          icon: '🚪',
          title: 'Logout',
          description: 'Successfully logged out of your account'
        }
        break
      case 'register':
        action = {
          ...action,
          category: 'auth',
          icon: '📝',
          title: 'Account Created',
          description: additionalData.role 
            ? `Account created successfully as ${additionalData.role}`
            : 'Account created successfully'
        }
        break
      case 'resume_upload':
        action = {
          ...action,
          category: 'profile',
          icon: '📄',
          title: 'Resume Uploaded',
          description: additionalData.fileName 
            ? `Resume "${additionalData.fileName}" uploaded successfully`
            : 'Your resume has been uploaded successfully'
        }
        break
      case 'resume_delete':
        action = {
          ...action,
          category: 'profile',
          icon: '🗑️',
          title: 'Resume Deleted',
          description: 'Your resume has been deleted successfully'
        }
        break
      case 'resume_update':
        action = {
          ...action,
          category: 'profile',
          icon: '📄',
          title: 'Resume Updated',
          description: additionalData.fileName 
            ? `Resume updated to "${additionalData.fileName}"`
            : 'Your resume has been updated successfully'
        }
        break
      case 'application_status':
        action = {
          ...action,
          category: 'application',
          icon: '📊',
          title: 'Application Status Updated',
          description: additionalData.status && additionalData.jobTitle
            ? `Application for ${additionalData.jobTitle}: ${additionalData.status}`
            : additionalData.status
            ? `Application status: ${additionalData.status}`
            : 'Application status updated'
        }
        break
      case 'internship_apply':
        action = {
          ...action,
          category: 'application',
          icon: '🎓',
          title: 'Internship Application Submitted',
          description: additionalData.internshipTitle && additionalData.companyName 
            ? `Applied for ${additionalData.internshipTitle} at ${additionalData.companyName}`
            : additionalData.internshipTitle 
            ? `Applied for ${additionalData.internshipTitle}`
            : 'Internship application submitted successfully'
        }
        break
      case 'job_save':
        action = {
          ...action,
          category: 'profile',
          icon: '⭐',
          title: 'Job Saved',
          description: additionalData.jobTitle 
            ? `Saved job: ${additionalData.jobTitle}`
            : 'Job saved to your favorites'
        }
        break
      case 'job_unsave':
        action = {
          ...action,
          category: 'profile',
          icon: '⭐',
          title: 'Job Removed from Saved',
          description: additionalData.jobTitle 
            ? `Removed ${additionalData.jobTitle} from saved jobs`
            : 'Job removed from saved jobs'
        }
        break
      default:
        action = {
          ...action,
          category: 'general',
          icon: 'ℹ️',
          title: 'Action Completed',
          description: additionalData.message || 'Action completed successfully'
        }
    }

    setActionHistory(prev => [action, ...prev.slice(0, 49)]) // Keep only last 50 actions
    return actionId
  }

  const showSuccess = (message, action = null, additionalData = {}) => {
    const actionId = action ? trackAction(action, additionalData) : null
    toast.success(message)
    addNotification(message, 'success', 5000, actionId)
  }

  const showError = (message, action = null, additionalData = {}) => {
    const actionId = action ? trackAction(action, additionalData) : null
    toast.error(message)
    addNotification(message, 'error', 7000, actionId)
  }

  const showInfo = (message, action = null, additionalData = {}) => {
    const actionId = action ? trackAction(action, additionalData) : null
    toast.info(message)
    addNotification(message, 'info', 5000, actionId)
  }

  const showWarning = (message, action = null, additionalData = {}) => {
    const actionId = action ? trackAction(action, additionalData) : null
    toast.warning(message)
    addNotification(message, 'warning', 6000, actionId)
  }

  // Get unread notifications count
  const getUnreadCount = () => {
    return actionHistory.filter(action => !action.read).length
  }

  // Get recent actions for notification panel
  const getRecentActions = (limit = 10) => {
    return actionHistory.slice(0, limit)
  }

  // Get actions by category
  const getActionsByCategory = (category) => {
    return actionHistory.filter(action => action.category === category)
  }

  // Mark all actions as read
  const markAllAsRead = () => {
    setActionHistory(prev => 
      prev.map(action => ({ ...action, read: true }))
    )
  }

  return (
    <NotificationContext.Provider value={{
      notifications,
      actionHistory,
      addNotification,
      removeNotification,
      markActionAsRead,
      markAllAsRead,
      clearAllNotifications,
      clearAllActions,
      showSuccess,
      showError,
      showInfo,
      showWarning,
      getUnreadCount,
      getRecentActions,
      getActionsByCategory,
      trackAction
    }}>
      {children}
      <Toaster />
    </NotificationContext.Provider>
  )
} 