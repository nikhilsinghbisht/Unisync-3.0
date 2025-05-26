package com.unisync.backend.features.feed.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReportRequestDTO {
    private boolean comment;
    private boolean post;
    private Long postId;
    private Long commentId;

    public boolean isComment() {
        return comment;
    }

    public void setComment(boolean comment) {
        this.comment = comment;
    }

    public boolean isPost() {
        return post;
    }

    public void setPost(boolean post) {
        this.post = post;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    @Override
    public String toString() {
        return "ReportRequestDTO{" +
                "comment=" + comment +
                ", post=" + post +
                ", postId=" + postId +
                ", commentId=" + commentId +
                '}';
    }
}
