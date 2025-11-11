import { Injectable } from '@angular/core';

export interface CaptchaData {
  question: string;
  answer: number;
}

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  
  /**
   * Generate a new captcha question
   */
  generateCaptcha(): CaptchaData {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const answer = num1 + num2;
    const question = `${num1} + ${num2} = ?`;
    
    return {
      question,
      answer
    };
  }

  /**
   * Validate captcha answer
   */
  validateCaptcha(userAnswer: string | number, correctAnswer: number): boolean {
    const userAnswerNum = typeof userAnswer === 'string' ? parseInt(userAnswer) : userAnswer;
    return !isNaN(userAnswerNum) && userAnswerNum === correctAnswer;
  }
}

