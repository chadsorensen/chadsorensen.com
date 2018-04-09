s3_bucket = "chadsorensen.com"
build_dir = "dist"

task :deploy do
  system("npm run build")
  system("aws s3 sync #{build_dir}/. s3://#{s3_bucket}")
end