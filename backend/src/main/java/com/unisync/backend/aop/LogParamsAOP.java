package com.unisync.backend.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LogParamsAOP {

    @Before("execution(* com.unisync.backend.features..controller..*(..)) || " +
            "execution(* com.unisync.backend.features..service..*(..))")
    public void logMethodParams(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        log.info("Parameters for {} are {}", joinPoint.getSignature().toShortString(), Arrays.toString(args));
    }
}
