<?php

namespace ArranJacques\Taniquetil\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use ArranJacques\Taniquetil\Exception;

class ExceptionMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var \ArranJacques\Taniquetil\Exception
     */
    protected $exception;

    /**
     * ExceptionMail constructor.
     *
     * @param \ArranJacques\Taniquetil\Exception $exception
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
