---
layout: post
title: 123
tags:
    - node
---

* toc
{:toc}

下面的代码从

```scheme
(define (square n)
  (* n n))

(define (smallest-divisor n)
  (find-divisor n 2))

(define (find-divisor n test-divisor)
  (cond ((> (square test-divisor) n) n)
        ((divides? test-divisor n) test-divisor)
        (else (find-divisor n (+ test-divisor 1)))))

(define (divides? a b)
  (= (remainder b a) 0))

(define (prime? n)
  (= n (smallest-divisor n)))

(define (timed-prime-test n)
  (display "start-with:")
  (displayln n)
  (start-prime-test n (current-milliseconds) 0))

(define (start-prime-test n start-time found-num)
  (if (= found-num 3)
      (report-prime (- (current-milliseconds) start-time))
      (if (prime? n)
          (begin
            (display "found: ")
            (displayln n)
            (start-prime-test (+ 2 n) start-time (+ found-num 1)))
          (start-prime-test (+ 2 n) start-time found-num))))

(define (report-prime elapsed-time)
  (display "time elapsed: ")
  (displayln elapsed-time)
  (displayln "----------------"))

(timed-prime-test 10000000001)
; (timed-prime-test 100000000001)
; (timed-prime-test 1000000000001)
; (timed-prime-test 10000000000001)
; (timed-prime-test 100000000000001)
; (timed-prime-test 1000000000000001)
```

```scheme
(define (coin i)
  (cond ((= i 1) 1)
        ((= i 2) 5)
        ((= i 3) 10)
        ((= i 4) 25)
        ((= i 5) 50)))
(define (calcNumbers amount use-coin-i-or-not)
            (cond ((or (< amount 0) (> use-coin-i-or-not 5)) 0)
                  ((= amount 0) 1)
                  (else (+ (calcNumbers amount (+ use-coin-i-or-not 1))
                           (calcNumbers (- amount (coin use-coin-i-or-not)) use-coin-i-or-not)))))

(define (exchange-coin amount)
            (calcNumbers amount 1))

(exchange-coin 100)
```