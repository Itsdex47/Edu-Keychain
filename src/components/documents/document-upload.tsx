'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download,
  Eye,
  Trash2,
  Shield
} from 'lucide-react'

interface DocumentFile {
  id: string
  name: string
  type: string
  size: number
  status: 'uploading' | 'processing' | 'verified' | 'failed'
  progress: number
  blockchainHash?: string
  uploadedAt: string
  url?: string
}

interface DocumentUploadProps {
  studentId?: string
  institutionId?: string
  onUploadComplete?: (document: DocumentFile) => void
}

export function DocumentUpload({ studentId, institutionId, onUploadComplete }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [documentType, setDocumentType] = useState<string>('')

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }, [])

  const handleFiles = async (files: FileList) => {
    if (!studentId) {
      console.error('No student ID provided')
      return
    }

    const newDocuments: DocumentFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading',
      progress: 0,
      uploadedAt: new Date().toISOString()
    }))

    setDocuments(prev => [...prev, ...newDocuments])

    // Upload each file
    for (let i = 0; i < newDocuments.length; i++) {
      const doc = newDocuments[i]
      const file = files[i]
      await uploadFile(doc.id, file)
    }
  }

  const uploadFile = async (documentId: string, file: File) => {
    try {
      // Create form data for the API
      const formData = new FormData()
      formData.append('file', file)
      formData.append('studentId', studentId || '')
      formData.append('institutionId', institutionId || 'cmgsgi50s0000t4aqp3fmc343') // Default to Stanford University for demo
      formData.append('title', file.name)
      formData.append('description', `Uploaded document: ${file.name}`)
      formData.append('documentType', documentType || 'other')

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, progress: Math.min(doc.progress + 10, 90) }
            : doc
        ))
      }, 200)

      // Upload to API
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)

      if (response.ok) {
        const result = await response.json()
        
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { 
                ...doc, 
                progress: 100, 
                status: 'verified',
                blockchainHash: result.data.blockchainHash,
                url: result.data.fileUrl
              }
            : doc
        ))

        if (onUploadComplete) {
          onUploadComplete({
            id: result.data.id,
            name: file.name,
            type: file.type,
            size: file.size,
            status: 'verified',
            progress: 100,
            blockchainHash: result.data.blockchainHash,
            uploadedAt: new Date().toISOString(),
            url: result.data.fileUrl
          })
        }
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'failed', progress: 0 }
          : doc
      ))
    }
  }

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }

  const getStatusIcon = (status: DocumentFile['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Upload className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = (status: DocumentFile['status']) => {
    const variants = {
      uploading: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      verified: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800"
    }
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Document Upload
        </CardTitle>
        <CardDescription>
          Upload and verify your documents with blockchain technology
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop documents here or click to browse
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Support for PDF, DOC, DOCX, JPG, PNG files up to 10MB
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="flex-1 max-w-xs">
              <Label htmlFor="document-type" className="text-sm font-medium text-gray-700">
                Document Type
              </Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transcript">Academic Transcript</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="identification">Identification</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </label>
              </Button>
            </div>
          </div>
        </div>

        {/* Documents List */}
        {documents.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <h5 className="font-medium text-gray-900">{doc.name}</h5>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {doc.status === 'uploading' && (
                    <div className="mb-3">
                      <Progress value={doc.progress} className="h-2" />
                      <p className="text-xs text-gray-600 mt-1">Uploading... {doc.progress}%</p>
                    </div>
                  )}

                  {/* Blockchain Verification */}
                  {doc.status === 'verified' && doc.blockchainHash && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Blockchain Verified
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-mono break-all">
                        Hash: {doc.blockchainHash}
                      </p>
                    </div>
                  )}

                  {/* Error State */}
                  {doc.status === 'failed' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          Verification Failed
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Please check the document and try again.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {doc.status === 'verified' && doc.url && (
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} download={doc.name}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {documents.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No documents uploaded yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Upload your first document to get started
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}