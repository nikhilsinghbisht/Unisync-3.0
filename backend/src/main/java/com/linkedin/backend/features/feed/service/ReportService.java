package com.linkedin.backend.features.feed.service;

import com.linkedin.backend.features.feed.dto.ReportRequestDTO;
import com.linkedin.backend.features.feed.model.Comment;
import com.linkedin.backend.features.feed.model.Post;
import com.linkedin.backend.features.feed.repository.CommentRepository;
import com.linkedin.backend.features.feed.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

    private static final int REPORT_THRESHOLD = 5;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    public String reportContent(ReportRequestDTO requestDTO) {
        if (requestDTO.isPost() && requestDTO.getPostId() != null) {
            Post post = postRepository.findById(requestDTO.getPostId())
                    .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + requestDTO.getPostId()));

            post.setReportCount(post.getReportCount() + 1);
            if (post.getReportCount() >= REPORT_THRESHOLD) {
                post.setIsVisible(true);
            }

            postRepository.save(post);
            return post.getReportCount() >= REPORT_THRESHOLD
                    ? "Post reported and hidden."
                    : "Post reported. Current report count: " + post.getReportCount();
        }

        if (requestDTO.isComment() && requestDTO.getCommentId() != null) {
            Comment comment = commentRepository.findById(requestDTO.getCommentId())
                    .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + requestDTO.getCommentId()));

            comment.setReportCount(comment.getReportCount() + 1);
            if (comment.getReportCount() >= REPORT_THRESHOLD) {
                comment.setIsVisible(true);
            }

            commentRepository.save(comment);
            return comment.getReportCount() >= REPORT_THRESHOLD
                    ? "Comment reported and hidden."
                    : "Comment reported. Current report count: " + comment.getReportCount();
        }

        throw new IllegalArgumentException("Invalid report request. Either postId or commentId must be provided.");
    }
}
