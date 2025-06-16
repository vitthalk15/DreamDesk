import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, File, Image, FileText } from 'lucide-react'
import { Button } from './button'
import { useNotification } from '../providers/NotificationProvider'

const FileUpload = ({ 
  onFileSelect, 
  accept = "image/*,.pdf,.doc,.docx", 
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  className = "",
  placeholder = "Drop files here or click to upload"
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [errors, setErrors] = useState([])
  const fileInputRef = useRef(null)
  const { showError, showSuccess } = useNotification()

  const validateFile = (file) => {
    const errors = []
    
    // Check file size
    if (file.size > maxSize) {
      errors.push(`${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`)
    }
    
    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim())
    const isValidType = allowedTypes.some(type => {
      if (type.includes('/*')) {
        return file.type.startsWith(type.replace('/*', '/'))
      }
      return file.type === type || file.name.toLowerCase().endsWith(type.replace('.', ''))
    })
    
    if (!isValidType) {
      errors.push(`${file.name} is not a supported file type`)
    }
    
    return errors
  }

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files)
    const newErrors = []
    const validFiles = []
    
    fileArray.forEach(file => {
      const fileErrors = validateFile(file)
      if (fileErrors.length > 0) {
        newErrors.push(...fileErrors)
      } else {
        validFiles.push(file)
      }
    })
    
    if (newErrors.length > 0) {
      setErrors(newErrors)
      newErrors.forEach(error => showError(error))
    }
    
    if (validFiles.length > 0) {
      const newFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles
      setSelectedFiles(newFiles)
      onFileSelect(multiple ? newFiles : validFiles[0])
      showSuccess(`Successfully uploaded ${validFiles.length} file(s)`)
    }
  }, [selectedFiles, multiple, onFileSelect, maxSize, accept, showError, showSuccess])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    handleFiles(files)
  }, [handleFiles])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = useCallback((e) => {
    const files = e.target.files
    handleFiles(files)
  }, [handleFiles])

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onFileSelect(multiple ? newFiles : newFiles[0] || null)
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />
    if (file.type.includes('pdf')) return <FileText className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {placeholder}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Supported formats: {accept} (Max: {maxSize / (1024 * 1024)}MB)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {errors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-red-600">Errors:</h4>
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload 