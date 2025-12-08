// CreateShipment component retired. This file kept as placeholder for history.

// The legacy CreateShipment component has been replaced by the unified `ShipmentForm` component.
// If you need to recover the legacy implementation it is available in version control history.

export default null;
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          <div className="space-y-6">
            {products.map((product, index) => (
              <div key={product.id} className="p-5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-900">Product {index + 1}</h3>
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Electronic Circuit Boards"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-700 mb-2">Product Description</label>
                    <textarea
                      value={product.description}
                      onChange={(e) => handleProductChange(product.id, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Detailed product description..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-700 mb-2">
                      HS Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={product.hsCode}
                      onChange={(e) => handleProductChange(product.id, 'hsCode', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 8541.10.00"
                      required
                    />
                    
                    {loadingSuggestions[product.id] && (
                      <p className="mt-2 text-sm text-purple-600 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        AI is analyzing product and suggesting HS codes...
                      </p>
                    )}
                    
                    {hsCodeSuggestions[product.id] && !loadingSuggestions[product.id] && (
                      <HSCodeSuggestionPanel 
                        productId={product.id} 
                        suggestions={hsCodeSuggestions[product.id]} 
                      />
                    )}
                    
                    {product.hsCode && <HSCodeValidationWidget productId={product.id} />}
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(product.id, 'quantity', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={product.weight}
                      onChange={(e) => handleProductChange(product.id, 'weight', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 50.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-slate-700 mb-2">
                      Product Value ({currency.code}) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        {currency.symbol}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={product.value}
                        onChange={(e) => handleProductChange(product.id, 'value', e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 5000.00"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-900">Total Shipment Value</p>
                  <p className="text-2xl text-blue-700">
                    {currency.symbol}{products.reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0).toFixed(2)} {currency.code}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700">
                    {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-blue-600">
                    Total Weight: {products.reduce((sum, p) => sum + (parseFloat(p.weight) || 0), 0).toFixed(2)} kg
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Origin Address */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Origin Address</h2>
              <p className="text-slate-500 text-sm">Shipper&apos;s complete address details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="originCountry"
                value={formData.originCountry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="IN">India</option>
                <option value="CN">China</option>
                <option value="GB">United Kingdom</option>
                <option value="JP">Japan</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="originCity"
                value={formData.originCity}
                onChange={handleChange}
                onBlur={() => validateField('originCity')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.originCity ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {validationErrors.originCity && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.originCity}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">
                Full Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="originAddress"
                value={formData.originAddress}
                onChange={handleChange}
                onBlur={() => validateField('originAddress')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.originAddress ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Street address, building number, etc."
                required
              />
              {validationErrors.originAddress && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.originAddress}
                </p>
              )}
              {validatedFields.has('originAddress') && !validationErrors.originAddress && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Address validated successfully
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                PIN/Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="originPinCode"
                value={formData.originPinCode}
                onChange={handleChange}
                onBlur={() => validateField('originPinCode')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.originPinCode ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {validationErrors.originPinCode && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.originPinCode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Phone (with country code) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="originPhone"
                value={formData.originPhone}
                onChange={handleChange}
                onBlur={() => validateField('originPhone')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.originPhone ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="+1 234 567 8900"
                required
              />
              {validationErrors.originPhone && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.originPhone}
                </p>
              )}
              {validatedFields.has('originPhone') && !validationErrors.originPhone && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Phone number validated
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="originEmail"
                value={formData.originEmail}
                onChange={handleChange}
                onBlur={() => validateField('originEmail')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.originEmail ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {validationErrors.originEmail && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.originEmail}
                </p>
              )}
              {validatedFields.has('originEmail') && !validationErrors.originEmail && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Email validated
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Destination Address */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-slate-900">Destination Address</h2>
              <p className="text-slate-500 text-sm">Receiver's complete address details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="destCountry"
                value={formData.destCountry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="IN">India</option>
                <option value="CN">China</option>
                <option value="GB">United Kingdom</option>
                <option value="JP">Japan</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="destCity"
                value={formData.destCity}
                onChange={handleChange}
                onBlur={() => validateField('destAddress')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.destCity ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {validationErrors.destCity && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.destCity}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">
                Full Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="destAddress"
                value={formData.destAddress}
                onChange={handleChange}
                onBlur={() => validateField('destAddress')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.destAddress ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Street address, building number, etc."
                required
              />
              {validationErrors.destAddress && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.destAddress}
                </p>
              )}
              {validatedFields.has('destAddress') && !validationErrors.destAddress && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Address validated successfully
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                PIN/Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="destPinCode"
                value={formData.destPinCode}
                onChange={handleChange}
                onBlur={() => validateField('destAddress')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.destPinCode ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {validationErrors.destPinCode && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.destPinCode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Phone (with country code) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="destPhone"
                value={formData.destPhone}
                onChange={handleChange}
                onBlur={() => validateField('destPhone')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.destPhone ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="+1 234 567 8900"
                required
              />
              {validationErrors.destPhone && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.destPhone}
                </p>
              )}
              {validatedFields.has('destPhone') && !validationErrors.destPhone && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Phone number validated
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="destEmail"
                value={formData.destEmail}
                onChange={handleChange}
                onBlur={() => validateField('destEmail')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.destEmail ? 'border-red-500' : 'border-slate-300'
                }`}
                required
              />
              {validationErrors.destEmail && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.destEmail}
                </p>
              )}
              {validatedFields.has('destEmail') && !validationErrors.destEmail && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Email validated
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => onNavigate('shipper-dashboard')}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isValidating}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Shipment & Run AI Check
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
