import { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Filter, 
  Search, 
  Eye, 
  Download, 
  Trash2,
  CheckCircle,
  Tag
} from 'lucide-react';

export function DocumentLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const documents = [
    {
      id: 1,
      name: 'Commercial_Invoice_SHP1001.pdf',
      category: 'Invoice',
      shipmentId: 'SHP-2024-1001',
      uploadDate: '2024-12-01',
      size: '245 KB',
      aiTags: ['Invoice', 'USD', 'Export'],
      status: 'verified'
    },
    {
      id: 2,
      name: 'Certificate_of_Origin_China.pdf',
      category: 'Certificate of Origin',
      shipmentId: 'SHP-2024-1001',
      uploadDate: '2024-12-01',
      size: '189 KB',
      aiTags: ['COO', 'China', 'Manufacturing'],
      status: 'verified'
    },
    {
      id: 3,
      name: 'MSDS_Lithium_Batteries.pdf',
      category: 'MSDS',
      shipmentId: 'SHP-2024-1003',
      uploadDate: '2024-12-02',
      size: '512 KB',
      aiTags: ['Safety', 'Hazardous', 'Batteries'],
      status: 'pending'
    },
    {
      id: 4,
      name: 'Packing_List_Headphones.xlsx',
      category: 'Packing List',
      shipmentId: 'SHP-2024-1001',
      uploadDate: '2024-12-01',
      size: '78 KB',
      aiTags: ['Packing', 'Weight', 'Quantities'],
      status: 'verified'
    },
    {
      id: 5,
      name: 'FCC_Certificate_Wireless.pdf',
      category: 'Compliance Certificate',
      shipmentId: 'SHP-2024-1002',
      uploadDate: '2024-12-02',
      size: '320 KB',
      aiTags: ['FCC', 'Wireless', 'Compliance'],
      status: 'verified'
    },
    {
      id: 6,
      name: 'Bill_of_Lading_DEC2024.pdf',
      category: 'Bill of Lading',
      shipmentId: 'SHP-2024-1005',
      uploadDate: '2024-11-30',
      size: '156 KB',
      aiTags: ['Shipping', 'Transport', 'Container'],
      status: 'verified'
    },
    {
      id: 7,
      name: 'Product_Specifications_Medical.pdf',
      category: 'Product Specs',
      shipmentId: 'SHP-2024-1006',
      uploadDate: '2024-12-01',
      size: '892 KB',
      aiTags: ['Medical', 'Technical', 'Specifications'],
      status: 'pending'
    },
    {
      id: 8,
      name: 'Import_License_Pharma.pdf',
      category: 'License',
      shipmentId: 'SHP-2024-1008',
      uploadDate: '2024-12-03',
      size: '234 KB',
      aiTags: ['License', 'Pharmaceutical', 'Import'],
      status: 'pending'
    }
  ];

  const categories = [
    'All Documents',
    'Invoice',
    'Certificate of Origin',
    'MSDS',
    'Packing List',
    'Compliance Certificate',
    'Bill of Lading',
    'Product Specs',
    'License'
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.aiTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc);
  };

  const handleClosePreview = () => {
    setSelectedDocument(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Document Library</h1>
        <p className="text-slate-600">Manage and organize all your shipment documents</p>
      </div>

      {/* Upload Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-dashed border-blue-300 mb-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-slate-900 mb-2">Upload Documents</h2>
          <p className="text-slate-600 mb-6">
            Drag and drop files here or click to browse
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg">
            Select Files
          </button>
          <p className="text-slate-500 text-sm mt-4">
            AI will automatically categorize and tag your documents
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category, index) => (
                <option key={index} value={index === 0 ? 'all' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documents List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <p className="text-slate-700">
                {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="divide-y divide-slate-100">
              {filteredDocuments.map((doc) => (
                <div 
                  key={doc.id} 
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => handleViewDocument(doc)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-slate-900 mb-1 truncate">{doc.name}</p>
                          <p className="text-slate-500 text-sm">Shipment: {doc.shipmentId}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm flex-shrink-0 ml-2 ${
                          doc.status === 'verified' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {doc.status === 'verified' ? '✓ Verified' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                        <span>{doc.category}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.uploadDate}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {doc.aiTags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDocument(doc);
                        }}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No documents found</p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Pane */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 sticky top-6">
            {selectedDocument ? (
              <div>
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-slate-900">Document Preview</h3>
                  <button 
                    onClick={handleClosePreview}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="w-full h-48 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-slate-400" />
                  </div>

                  <h4 className="text-slate-900 mb-4 break-words">{selectedDocument.name}</h4>

                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-slate-600 text-sm mb-1">Category</p>
                      <p className="text-slate-900">{selectedDocument.category}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm mb-1">Shipment ID</p>
                      <p className="text-slate-900">{selectedDocument.shipmentId}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm mb-1">Upload Date</p>
                      <p className="text-slate-900">{selectedDocument.uploadDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm mb-1">File Size</p>
                      <p className="text-slate-900">{selectedDocument.size}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm mb-1">Status</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                        selectedDocument.status === 'verified' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {selectedDocument.status === 'verified' ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verified
                          </>
                        ) : (
                          'Pending Review'
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-slate-600 text-sm mb-2">AI Auto-Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDocument.aiTags.map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4 inline mr-1" />
                      Download
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Eye className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Select a document to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
