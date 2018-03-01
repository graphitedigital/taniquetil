<?php

namespace Pallant\Taniquetil\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Pallant\Taniquetil\Exception;

class ExceptionMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var \Pallant\Taniquetil\Exception
     */
    protected $exception;

    /**
     * ExceptionMail constructor.
     *
     * @param \Pallant\Taniquetil\Exception $exception
     */
    public function __construct(Exception $exception)
    {
        $this->exception = $exception;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('taniquetil::mail.exception', [
            'exception' => $this->exception,
        ]);
    }

}
