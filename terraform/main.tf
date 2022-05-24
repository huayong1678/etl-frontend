provider "aws" {
  region = var.region
}

variable "region" {
  default = "us-east-1"
}

variable "project-name" {
  default = "etl-frontend"
}

resource "aws_s3_bucket" "frontend-bucket" {
  tags = {
    Name = "${var.project-name}-bucket"
  }
  bucket        = var.project-name
  force_destroy = true
}

# resource "aws_s3_bucket_acl" "bucket-acl" {
#   bucket = aws_s3_bucket.frontend-bucket.bucket
#   # acl    = "private"
#   acl    = "public-read"
# }

resource "aws_s3_bucket_ownership_controls" "s3-ownership" {
  bucket = aws_s3_bucket.frontend-bucket.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "s3-acl" {
  bucket = aws_s3_bucket.frontend-bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

data "aws_iam_policy_document" "s3-policy-cloudfront" {
  statement {
    sid       = "PublicReadGetObject"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.frontend-bucket.arn}/*"]

    principals {
      type = "AWS"
      # identifiers = ["*"]
      identifiers = [aws_cloudfront_origin_access_identity.origin-access-identity.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "s3-cloudfront-policy" {
  bucket = aws_s3_bucket.frontend-bucket.id
  policy = data.aws_iam_policy_document.s3-policy-cloudfront.json
}

# resource "aws_s3_bucket_versioning" "bucket-versioning" {
#   bucket = aws_s3_bucket.frontend-bucket.bucket
#   versioning_configuration {
#     status = "Enabled"
#   }
# }

resource "aws_s3_bucket_website_configuration" "site-hosting" {
    depends_on = [
      aws_s3_bucket.frontend-bucket
    ]
  bucket = aws_s3_bucket.frontend-bucket.bucket
  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_object" "html" {
  for_each     = fileset("../build/", "**/*.html")
  bucket       = aws_s3_bucket.frontend-bucket.bucket
  key          = each.value
  source       = "../build/${each.value}"
  etag         = filemd5("../build/${each.value}")
  content_type = "text/html"
}

resource "aws_s3_object" "css" {
  for_each     = fileset("../build/", "**/*.css*")
  bucket       = aws_s3_bucket.frontend-bucket.bucket
  key          = each.value
  source       = "../build/${each.value}"
  etag         = filemd5("../build/${each.value}")
  content_type = "text/css"
}

resource "aws_s3_object" "js" {
  for_each     = fileset("../build/", "**/*.js*")
  bucket       = aws_s3_bucket.frontend-bucket.bucket
  key          = each.value
  source       = "../build/${each.value}"
  etag         = filemd5("../build/${each.value}")
  content_type = "application/javascript"
}

resource "aws_s3_object" "images-png" {
  for_each     = fileset("../build/", "**/*.png")
  bucket       = aws_s3_bucket.frontend-bucket.bucket
  key          = each.value
  source       = "../build/${each.value}"
  etag         = filemd5("../build/${each.value}")
  content_type = "image/png"
}

resource "aws_s3_object" "images-svg" {
  for_each     = fileset("../build/", "**/*.svg")
  bucket       = aws_s3_bucket.frontend-bucket.bucket
  key          = each.value
  source       = "../build/${each.value}"
  etag         = filemd5("../build/${each.value}")
  content_type = "image/svg+xml"
}

resource "aws_s3_object" "favicon" {
  for_each     = fileset("../build/", "**/*.ico")
  bucket       = aws_s3_bucket.frontend-bucket.bucket
  key          = each.value
  source       = "../build/${each.value}"
  etag         = filemd5("../build/${each.value}")
  content_type = "image/x-icon"
}

resource "aws_s3_object" "fonts-ttf" {
  for_each     = fileset("../build/", "**/*.ttf")
  bucket       = aws_s3_bucket.frontend-bucket.bucket
  key          = each.value
  source       = "../build/${each.value}"
  etag         = filemd5("../build/${each.value}")
  content_type = "font/ttf"
}

resource "aws_s3_object" "fonts-woff2" {
  for_each     = fileset("../build/", "**/*.woff2")
  bucket       = aws_s3_bucket.frontend-bucket.bucket
  key          = each.value
  source       = "../build/${each.value}"
  etag         = filemd5("../build/${each.value}")
  content_type = "font/woff2"
}

resource "aws_s3_object" "txt" {
  for_each     = fileset("../build/", "**/*.txt")
  bucket       = aws_s3_bucket.frontend-bucket.bucket
  key          = each.value
  source       = "../build/${each.value}"
  etag         = filemd5("../build/${each.value}")
  content_type = "text/plain"
}

resource "aws_s3_object" "json" {
  for_each     = fileset("../build/", "**/*.json*")
  bucket       = aws_s3_bucket.frontend-bucket.bucket
  key          = each.value
  source       = "../build/${each.value}"
  etag         = filemd5("../build/${each.value}")
  content_type = "application/json"
}

resource "aws_cloudfront_origin_access_identity" "origin-access-identity" {
  comment = "S3 OAI for Web Hosting"
}

resource "aws_cloudfront_distribution" "site-hosting" {
  depends_on = [
    aws_s3_bucket.frontend-bucket
  ]
  origin {
    domain_name = aws_s3_bucket.frontend-bucket.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.frontend-bucket.website_endpoint
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin-access-identity.cloudfront_access_identity_path
    }
  }
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.frontend-bucket.website_endpoint
    viewer_protocol_policy = "allow-all"
    forwarded_values {
      cookies {
        forward = "all"
      }
      query_string = false
    }
  }
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}


# Print the files processed so far
output "fileset-results-html" {
  value = fileset("../dist/", "**/*.html")
}
output "web-endpoint" {
  value = aws_s3_bucket.frontend-bucket.website_endpoint
}
output "distribute-domain" {
  value = aws_cloudfront_distribution.site-hosting.domain_name
}
