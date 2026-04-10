## ADDED Requirements

### Requirement: Product images Supabase Storage bucket
The system SHALL use a Supabase Storage bucket named `product-images` for product images. The bucket MUST be publicly readable for anyone and writable only by authenticated admin users.

#### Scenario: Product image is publicly accessible
- **WHEN** an image is uploaded to `product-images/product-123.jpg`
- **THEN** it can be viewed at the public URL without authentication

#### Scenario: Unauthenticated upload is rejected
- **WHEN** an unauthenticated user attempts to upload to the bucket
- **THEN** the upload fails with a permission error

### Requirement: Image upload API route
The system SHALL provide `POST /api/upload-image` route that accepts a multipart form with an image file, uploads it to Supabase Storage using the service role key, and returns the public URL. Only authenticated admin users can access this route.

#### Scenario: Admin uploads product image
- **WHEN** an authenticated admin POSTs an image file to `/api/upload-image`
- **THEN** the image is stored in `product-images` bucket and the response contains the public URL

### Requirement: Existing public images remain functional
All images currently in `public/` (e.g., `/shoe_black_01.jpeg`) SHALL continue to work without modification. New images uploaded via the admin SHALL use Supabase Storage URLs.

#### Scenario: Existing product page displays public images
- **WHEN** a product with images from `public/` is viewed
- **THEN** all images load correctly from their existing paths
