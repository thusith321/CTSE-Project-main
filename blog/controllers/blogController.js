import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Blog } from "../models/blogSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllBlogs = catchAsyncErrors(async (req, res, next) => {
  const blogs = await Blog.find();
  res.status(200).json({
    success: true,
    blogs,
  });
});

export const postBlog = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const {
    title,
    description,
  } = req.body;

  if (!title || !description) {
    return next(new ErrorHandler("Please provide full post details.", 400));
  }

  const postedBy = req.user._id;
  const blog = await Blog.create({
    title,
    description,
    postedBy,
  });
  res.status(200).json({
    success: true,
    message: "Blog Posted Successfully!",
    blog,
  });
});

export const updateBlog = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  let blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler("OOPS! Tech Blog not found.", 404));
  }
  blog = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Tech Blog Updated!",
  });
});

export const deletelog = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler("Tech Blog not found.", 404));
  }
  await Blog.deleteOne();
  res.status(200).json({
    success: true,
    message: "Tech Blog Deleted!",
  });
});

export const getSingleBlog = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return next(new ErrorHandler("Blog not found.", 404));
    }
    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});