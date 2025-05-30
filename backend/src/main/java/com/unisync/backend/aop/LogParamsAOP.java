package com.unisync.backend.aop;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LogParamsAOP {

    @Autowired
    private HttpServletRequest request;

    @Before("execution(* com.unisync.backend.features..controller..*(..))")
    public void logControllerMethodParams(JoinPoint joinPoint) {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes instanceof ServletRequestAttributes servletRequestAttributes) {
            HttpServletRequest req = servletRequestAttributes.getRequest();

            String httpMethod = req.getMethod();
            String requestURI = req.getRequestURI();
            Object[] args = joinPoint.getArgs();

            String methodName = ((MethodSignature) joinPoint.getSignature()).getMethod().getName();
            String className = joinPoint.getTarget().getClass().getSimpleName();

            log.info("API Call -> [{} {}] - {}.{}(..)", httpMethod, requestURI, className, methodName);
            log.info("Parameters: {}", Arrays.toString(args));
        }
    }

    @Before("execution(* com.unisync.backend.features..service..*(..))")
    public void logServiceMethodParams(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        String methodName = ((MethodSignature) joinPoint.getSignature()).getMethod().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        log.info("Service Call -> {}.{}(..)", className, methodName);
        log.info("Parameters: {}", Arrays.toString(args));
    }

    @AfterThrowing(pointcut = "execution(* com.unisync.backend.features..controller..*(..))", throwing = "ex")
    public void logControllerExceptions(JoinPoint joinPoint, Throwable ex) {
        log.error("Exception in {}.{}(..): {}",
                joinPoint.getTarget().getClass().getSimpleName(),
                joinPoint.getSignature().getName(),
                ex.getMessage());
    }

}
