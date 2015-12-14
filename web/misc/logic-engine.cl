
#|

     Horn Clause Inference Engine, along the lines of Prolog

(c) Daniel Winterstein, 2002

contact: danielw@dai.ed.ac.uk

Disclaimer: All usual discalimers apply

|#



(eval-when (compile)
  (declaim (optimize (speed 3) (safety 2) (space 0) (debug 0))))

; dunno what this does, but the compiler recommends it
;(generate-filled-ef-templates :external-formats ':utf8-base)

(defpackage "inference"
  (:use "common-lisp")
  (:nicknames "logic")
  (:export "<-" "<-t" "top-prove" "answer" "query" "find-all" "clear-kb" "clear-temp-kb")
  )


; EXAMPLE

;(clrhash *kb*)
;(<- (parent donald nancy))        ; predicates are evaluated in order, top-most first
;(<- (parent donald debbie))
;(<- (male donald))
;(<- (father ?x ?y) (and (parent ?x ?y) (male ?x)))
;(<- (= ?x ?x))
;(<- (sibling ?x ?y) (and (parent ?z ?x)
;                         (parent ?z ?y)
;                         (not (= ?x ?y))))
;
; (query '(sibling ?a ?b)) => ((?b . debbie) (?a . nancy))
;
; (answer (sibling ?x ?y) (format nil "~A is the sibling of ~A." ?x ?y))




(in-package inference)


(defun clear-kb ()   "Clears the main and temporary Knowledge Bases"
  (clrhash *kb*) (clrhash *temp-kb*))

(defun clear-temp-kb () "Clears the temporary Knowledge Base" 
  (clrhash *temp-kb*))

(defun match (x y &optional binds)
  "inputs: x y &optional binds
returns: binds, t/f"
  (declare (type list binds))
  (cond
   ((equal x y) (values binds t))
   ((assoc x binds :test #'equal) (match (binding x binds) y binds))
   ((assoc y binds :test #'equal) (match x (binding y binds) binds))
   ((var? x) (values (cons (cons x y) binds) t))
   ((var? y) (values (cons (cons y x) binds) t))
   (t
    (when (and (consp x) (consp y))
      (multiple-value-bind (b2 yes)
          (match (car x) (car y) binds)
        (and yes (match (cdr x) (cdr y) b2)))))
   ))


(defun var? (x)
  (and (symbolp x) (eql (char (symbol-name x) 0) #\?))
  )


(defun binding (x binds)
  (declare (type list binds))
  (let ((b (assoc x binds :test #'equal)))
    (if b
        (or (binding (cdr b) binds)
            (cdr b))
      )))


(defvar *kb* (make-hash-table :test 'equal) 
  "Knowledge Base (KB) for the logic engine: a hash-table of rules and facts")

(defvar *temp-kb* (make-hash-table :test 'equal) 
  "Temporary KB for the logic engine: a hash-table of rules and facts added to the main KB")


(defmacro <- (con &optional ant)
  "inputs: consequent &optional antecedent
Adds a rule to the KB"
  `(length (push (cons (cdr ',con) ',ant)
                 (gethash (car ',con) *kb*)))
  )


(defun <-t (con &optional ant)
  "inputs: consequent &optional antecedent
Adds a rule to the temporary KB"
  (length (push (cons (cdr con) ant)
                (gethash (car con) *temp-kb*)))
  )

(defun query (expr)
  "inputs: expression
returns: solution-bindings/nil"
  (let ((binds (prove expr '((t . t)))))
    (when binds
      (clean-bindings expr binds))
    ))

(defun top-prove (expr)
  "inputs: expr binds
returns: t/nil
Use query if you wish to know the variable bindings in the solution."
  (when (prove expr '((t . t))) t)
  )

(defun find-all (expr)
  "inputs: expr
returns: list of solutions
Find all solutions to expr
Note: This finds all the proofs of expr, and returns the bindings given by each proof.
Depending on the rule base, this may give repeated solutions, or get stuck in an infinite loop."
  (let ((result nil)
        (cont :init))
    (loop
      (multiple-value-bind (r c)
          (prove expr '((t . t)) cont)
        (if r 
            (progn (setq result (cons (clean-bindings expr r) result))
              (setq cont c)) ;end-progn
          (return nil)
          )) ;end-mvb
      ) ;end-loop
    result))

(defun clean-bindings (expr bindings)
  "inputs: expr bindings
returns: bindings
Get rid of internal variables created during the proof search"
  (let ((vars (vars-in expr)))
    (remove nil
            (mapcar (lambda (b)
                      (if (member (car b) vars :test #'equal)
                          (cons (car b) (binding (car b) bindings))
                        nil))
              bindings))
    ))

(defun prove (expr binds &optional (cont :init))
  "inputs: expr binds &optional continuation
returns: solution-list/nil, continuation
If you catch the continuation (using multiple-value-bind), it can be
passed in later calls to prove to get different answers"
  (declare (type list binds))
  (case (car expr)
    (and (prove-and (cdr expr) binds cont))
    (or (prove-or (cdr expr) binds cont))
    (not (prove-not (cadr expr) binds cont)) ;not does not bind anything
    (t (prove-simple (car expr) (cdr expr) binds cont))
    )
  )

(defun prove-simple (pred args binds &optional (cont :init))
  (declare (type list binds))
  (let (expr-bc   ; ((head . body) binds cont-from-body)
        expr head body b1
        )
    (cond ((eq cont :init)
           (prove-simple pred args binds 
                         (reverse   ; put predicates in prolog order (ie. topmost first)
                          ; otherwise, the last <- evaluated, is the first to be checked
                          (mapcar (lambda (p) (list p binds :init))
                            (mapcar #'change-vars
                              (append (gethash pred *kb*) (gethash pred *temp-kb*))) ;potential predicates
                            )))
           ) ;end-init
          ((null (setq expr-bc (car cont))) nil) ; failure
          ((null (cdr expr-bc)) (prove-simple pred args binds (cdr cont)))
          ((eq (nth 2 expr-bc) :init)
           (setq expr (car expr-bc))
           (setq head (car expr))
           (multiple-value-bind (b2 yes)
               (match args head binds)
             (if yes
                 (if (setq body (cdr expr))
                     (multiple-value-bind (b3 c3)
                         (prove body b2)
                       (if b3 ; body succeeds
                           (values b3 (cons (list expr b2 c3)
                                            (cdr cont)))
                         (prove-simple pred args binds (cdr cont)) ;body fails, move on
                         )) ;end-body
                   (values b2 (cdr cont)) ;no body - just a matching head -succeed
                   ) ;end-yes-match
               ; no match
               (prove-simple pred args binds (cdr cont)) ;move on to next poss
               )) ;end-mvb
           ) ;end-expr-bc-init                    
          (t
           (setq expr (car expr-bc))
           (setq head (car expr))
           (setq body (cdr expr))
           (setq b1 (nth 1 expr-bc))
           (multiple-value-bind (b2 c2)
               (prove body b1 (nth 2 expr-bc))
             (if b2 (values b2 (cons (list expr b1 c2) (cdr cont)))
               (prove-simple pred args binds (cdr cont))
               ) ;end-if
             )) ;end-t
          ) ;end-cond
    ))



(defun prove-and (clauses binds &optional (cont :init))
  ; cont is a list of conts ((cont-for-1st-clause binds-for-others) . other-conts)
  (declare (type list binds clauses))
  (cond ((and (null clauses) (eq cont :init)) (values binds nil))  ; all clauses done, succeed
        ((null clauses) nil) ; can't redo
        ((eq cont :init)
         (multiple-value-bind (b2 c2)
             (prove (car clauses) binds)
           (if b2
               (multiple-value-bind (b3 c3)
                   (prove-and (cdr clauses) b2)
                 (if b3 (values b3 (cons (cons c2 b2) c3)) ;success
                   (prove-and clauses binds (cons :retry c2)) ;retry 1st clause
                   )) ;end-mvb
             nil ; fail
             )
           )) ;end-init
        ((eq (car cont) :retry) ;retry 1st clause
         (multiple-value-bind (b2 c2)
             (prove (car clauses) binds (cdr cont))
           (if b2
               (multiple-value-bind (b3 c3)
                   (prove-and (cdr clauses) b2)
                 (if b3 (values b3 (cons (cons c2 b2) c3)) ;success
                   (prove-and clauses binds (cons :retry c2)) ;retry 1st clause
                   )) ;end-mvb
             nil ; fail
             )
           )) ;end-retry-1st
        (t
         (multiple-value-bind (b3 c3)
             (prove-and (cdr clauses) (cdr (car cont)) (cdr cont)) ;redo further down if possible
           (if b3 (values b3 (cons (car cont) c3))
             ;fail on other clauses - retry this one
             (prove-and clauses binds (cons :retry (car (car cont))))
             ))
         )
        ))


(defun prove-or (clauses binds &optional (cont :init))
  (declare (type list binds clauses))
  (cond ((null clauses) nil) ;cant succeed
        ((eq cont :init)
         (prove-or clauses binds (make-list (length clauses) :initial-element :init)))
        ((null (car cont))
         (multiple-value-bind (b3 c3)
             (prove-or (cdr clauses) binds (cdr cont))
           (if b3 (values b3 (cons nil c3))
             nil)
           ))
        (t (multiple-value-bind (b2 c2)   ; 1st clause has continues
               (prove (car clauses) binds (car cont))
             (if b2 (values b2 (cons c2 (cdr cont)))   ; success - return
               (prove-or clauses binds (cons nil (cdr cont))) ; try other clauses
               ))
           ) ;end-t
        ))


(defun prove-not (clause binds &optional (cont :init))
  (declare (type list binds))
  (when (eq cont :init) ;1 soln only!
    (if (prove clause binds)
        nil
      (values binds nil) ; no continues for a not - 1 soln only
      )
    ) ;end-when
  )


(defun change-vars (r)
  "inputs: predicate
returns: predicate
substitute fresh variables into predicate"
  (sublis (mapcar #'(lambda (v) (cons v (gensym "?")))
            (vars-in r))
          r))


(defun vars-in (expr)
  (if (atom expr)
      (if (var? expr) (list expr))
    (union (vars-in (car expr))
           (vars-in (cdr expr)))
    ))


(defmacro answer (query &body body)
  "inputs: query &body body
returns: ?-list
Find all solutions to query, evaluate body for each one,
return a list of these evaluations"
  (let ((binds (gensym)) (results (gensym)))
    `(let ((,results nil))
       (dolist (,binds (prove ',query) ,results)
         (let ,(mapcar #'(lambda (v) 
                           `(,v (binding ',v ,binds)))
                 (vars-in query))
           (setf ,results (cons ,@body ,results)))

         ))
    ))

