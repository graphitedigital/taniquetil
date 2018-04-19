<?php

namespace ArranJacques\Taniquetil\NotificationChannels;

use Illuminate\Mail\Mailer;
use ArranJacques\Taniquetil\Exception;
use ArranJacques\Taniquetil\Mail\ExceptionMail;
use ArranJacques\Taniquetil\Support\Traits\ParseException;

class MailChannel implements NotificationChannelDriver
{
    use ParseException;

    /**
     * @var \Illuminate\Mail\Mailer
     */
    protected $mailer;

    /**
     * @var array
     */
    protected $config;

    /**
     * MailChannel constructor.
     *
     * @param \Illuminate\Mail\Mailer $mailer
     * @param array $config
     */
    public function __construct(Mailer $mailer, array $config)
    {
        $this->mailer = $mailer;
        $this->config = $config;
    }

    /**
     * Notify of a given exception.
     *
     * @param \ArranJacques\Taniquetil\Exception|\Throwable $exception
     */
    public function notify($exception)
    {
        if ($exception instanceof \Throwable) {
            $exception = new Exception((object)$this->deconstructException($exception));
        }

        foreach ($this->config['to'] as $recipient) {
            $this->sendEmail($exception, $recipient);
        }
    }

    /**
     * @param \ArranJacques\Taniquetil\Exception $exception
     * @param array $to
     */
    protected function sendEmail(Exception $exception, array $to)
    {
        $mail = (new ExceptionMail($exception))
            ->subject($this->getSubject())
            ->to($to['address'], $to['name']);

        if (isset($this->config['from'])) {
            $mail->from(
                $this->config['from']['address'], $this->config['from']['name']
            );
        }

        $this->mailer->send($mail);
    }

    /**
     * @return string
     */
    protected function getSubject(): string
    {
        $domain = parse_url(config('app.url'))['host'];

        return str_replace('{domain}', $domain, $this->config['subject']);
    }

}
