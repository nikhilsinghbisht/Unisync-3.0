package com.unisync.backend.features.feed.service;

import com.unisync.backend.features.feed.Constant;
import com.unisync.backend.features.feed.dto.ReportRequestDTO;
import com.unisync.backend.features.feed.model.Comment;
import com.unisync.backend.features.feed.model.Post;
import com.unisync.backend.features.feed.repository.CommentRepository;
import com.unisync.backend.features.feed.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class ReportService {


    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    public String reportContent(ReportRequestDTO requestDTO) {
        if (requestDTO.isPost() && requestDTO.getPostId() != null) {
            Post post = postRepository.findById(requestDTO.getPostId())
                    .orElseThrow(() -> new IllegalArgumentException("Post not found with ID: " + requestDTO.getPostId()));

            post.setReportCount(Objects.requireNonNullElse(post.getReportCount(), 0L) + 1);
            if (post.getReportCount() >= Constant.REPORT_THRESHOLD) {
                post.setIsVisible(false);
            }

            postRepository.save(post);
            return post.getReportCount() >= Constant.REPORT_THRESHOLD
                    ? "Post reported and hidden."
                    : "Post reported. Current report count: " + post.getReportCount();
        }

        if (requestDTO.isComment() && requestDTO.getCommentId() != null) {
            Comment comment = commentRepository.findById(requestDTO.getCommentId())
                    .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + requestDTO.getCommentId()));

            comment.setReportCount(comment.getReportCount() + 1L);
            if (comment.getReportCount() >= Constant.REPORT_THRESHOLD) {
                comment.setIsVisible(false);
            }

            commentRepository.save(comment);
            return comment.getReportCount() >= Constant.REPORT_THRESHOLD
                    ? "Comment reported and hidden."
                    : "Comment reported. Current report count: " + comment.getReportCount();
        }

        throw new IllegalArgumentException("Invalid report request. Either postId or commentId must be provided.");
    }
}
