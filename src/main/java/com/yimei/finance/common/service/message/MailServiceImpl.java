package com.yimei.finance.common.service.message;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.Properties;

/**
 * Created by fanjun on 15-6-1.
 */
@Service("mailService")
public class MailServiceImpl {

    Logger logger = LoggerFactory.getLogger(MailServiceImpl.class);
    protected JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();

    @Value("${notice_server_mail.name}")
    private String USERNAME;
    @Value("${notice_server_mail.password}")
    private String PASSWORD;
    @Value("${notice_server_mail.smtp}")
    private String Mail_Server_Smtp;

    private final String Mail_Transport_Protocol = "mail.transport.protocol";
    private final String Mail_Smtp_Auth = "mail.smtp.auth";
    private final String Mail_Smtp_Starttls_Enable = "mail.smtp.starttls.enable";
    private final String Mail_Debug = "mail.debug";


    /**
     * 发送 Simple 邮件
     *
     * @param to      收件人
     * @param subject
     * @param content 内容
     */
    public void sendSimpleMail(String to, String subject, String content) {
        SimpleMailMessage msg = new SimpleMailMessage();
        //设置发送邮件服务信息
        javaMailSender.setHost(Mail_Server_Smtp);
        javaMailSender.setPort(25);
        javaMailSender.setUsername(USERNAME);
        javaMailSender.setPassword(PASSWORD);
        javaMailSender.setJavaMailProperties(new Properties() {{
            put(Mail_Transport_Protocol, "smtp");
            put(Mail_Smtp_Auth, true);
            put(Mail_Smtp_Starttls_Enable, true);
            put(Mail_Debug, true);
        }});
        msg.setFrom(USERNAME);
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(content);
        logger.info(" ----------------------------------------- email: ");
        logger.info(" ----------------------------------------- email: ");
        logger.info(content);
        logger.info(" ----------------------------------------- email: ");
        logger.info(" ----------------------------------------- email: ");
        try {
            javaMailSender.send(msg);
            logPrint(to, "验证码邮件", content);
        } catch (Exception x) {
            logger.error("邮件发送失败：", x);
        }
    }

    /**
     * 发送 Html 邮件
     *
     * @param to 收件人
     */
    public void sendHtmlMail(final String to, String subject, String content) {
        javaMailSender.setHost(Mail_Server_Smtp);
        javaMailSender.setPort(25);
        javaMailSender.setUsername(USERNAME);
        javaMailSender.setPassword(PASSWORD);
        javaMailSender.setJavaMailProperties(new Properties() {{
            put(Mail_Transport_Protocol, "smtp");
            put(Mail_Smtp_Auth, true);
            put(Mail_Smtp_Starttls_Enable, true);
            put(Mail_Debug, true);
        }});
        MimeMessage msg = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = null;
        logger.info(" ----------------------------------------- email: ");
        logger.info(" ----------------------------------------- email: ");
        logger.info(content);
        logger.info(" ----------------------------------------- email: ");
        logger.info(" ----------------------------------------- email: ");
        try {
            helper = new MimeMessageHelper(msg, true, "utf-8");
            helper.setFrom(USERNAME);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            javaMailSender.send(msg);
        } catch (MailException e) {
            logger.info(" -------------------------------- ");
            logger.info(" 邮件发送失败 ");
            if (e.getMessage().indexOf("Invalid Addresses") > 0) {
                logger.info("不存在的邮箱!");
            } else {
                logger.info(e.getMessage());
            }
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void logPrint(String email, String mailType, String content) {
        logger.info(" -------------------------------- ");
        logger.info(LocalDateTime.now() + ":系统向用户邮箱" + email + "发送" + mailType + "成功!");
        logger.info("内容: " + content);
    }

}
