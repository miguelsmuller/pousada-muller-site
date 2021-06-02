import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { IEmail } from '@app/shared/email.interface';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private emailApi = environment.emailApi;
  public emailInSending = false;

  constructor(
    private serviceRequest: HttpClient
  ) { }

  private sendEmail(data: IEmail): Observable<any>{
    this.emailInSending = true;

    const httpUrl = `${this.emailApi.emailApiUrl}/messages`;
    const httpHeader = new HttpHeaders().append('Authorization', 'Basic ' + btoa(this.emailApi.emailApiKey));

    const httpBody = new FormData();
    httpBody.set('from', `${data.fromName}<${data.fromEmail}>`);
    httpBody.set('to', `${data.toName}<${data.toEmail}>`);
    httpBody.set('subject', data.subejct );
    httpBody.set('h:Reply-To', data.replyTo);
    httpBody.set('html', data.content);

    return this.serviceRequest.post<any>(httpUrl, httpBody, { headers: httpHeader })
    .pipe(
      retry(2)
    );
  }

  proceedReservation(data: FormGroup, ): Observable<any> {
    return forkJoin({
        emailReservationClient: this.sendProceedReservationClient(data),
        emailReservationPousada: this.sendProceedReservationPousada(data)
    })
    .pipe(
      catchError(error => {
        return throwError({code: error.status, message: error.message});
      })
    );
  }

  private sendProceedReservationClient(data: FormGroup, ): Observable<any> {
    let clientEmailData: IEmail = {
      fromName: 'Pousada Müller',
      fromEmail: 'contato@hotelmulller.com.br',
      replyTo: data.value.input_reservation_mail,
      toName: data.value.input_reservation_name,
      toEmail: data.value.input_reservation_mail,
      subejct: 'Pousada Müller - Solicitação de Reserva',
      content: ''
    };

    const htmlEmailClient = `<p>Olá <span style="font-weight:bold">${clientEmailData.toName}</span></p>
    <p>Obrigado por entrar em contato conosco! </p>
    <p><span style="font-weight:bold">Não é necessário responder esse email</span>. Nós iremos verificar a disponibilidade de unidades para o período informado e entraremos em contato o quanto antes.</p>
    <p>Você já conhece a nossa <a href="http://www.facebook.com.br/hotelmuller" target="_blank">fã page no facebook</a> ou nosso <a href="https://plus.google.com/+HotelMüllerRioClaro" target="_blank">perfil no google+</a> ? Curtá lá e fique sabendo na hora das novidades, das promoções e dos pacotes para os feriados.</p>
    <p>Atenciosamente,<br>Hotel Müller</p>
    <br>
    <p><a href="https://www.hotelmuller.com.br" target="_blank">https://www.hotelmuller.com.br</a><br>
    <a href="http://www.facebook.com.br/hotelmuller" target="_blank">http://www.facebook.com.br/hotemuller</a></p>`;

    clientEmailData = {...clientEmailData, content: htmlEmailClient};

    return this.sendEmail(clientEmailData);
  }

  private sendProceedReservationPousada(data: FormGroup, ): Observable<any> {
    let pousadaDataEmail: IEmail = {
      fromName: data.value.input_reservation_name,
      fromEmail: data.value.input_reservation_mail,
      replyTo: data.value.input_reservation_mail,
      toName: 'Pousada Müller',
      toEmail: 'contato@hotelmuller.com.br',
      subejct: `Site - Reserva - ${data.value.input_reservation_name}`,
      content: ''
    };

    const htmlEmailPousada = `<p><strong>Remetente:</strong> ${pousadaDataEmail.fromName}<[${pousadaDataEmail.fromEmail}]></p>
    <p><strong>Telefone:</strong> ${data.value.input_reservation_phone}</p>
    <p><strong>Q.Unidades:</strong> ${data.value.input_reservation_qunits}</p>
    <p><strong>Q.Pessoas:</strong> ${data.value.input_reservation_qpeoples}</p>
    <p><strong>Q.Crianças:</strong> ${data.value.input_reservation_qchildren}</p>
    <p><strong>D. Entrada:</strong> ${data.value.input_reservation_period1}</p>
    <p><strong>D. Saída:</strong> ${data.value.input_reservation_period2}</p>`;

    pousadaDataEmail = {...pousadaDataEmail, content: htmlEmailPousada};

    return this.sendEmail(pousadaDataEmail);
  }

  proceedContact(data: FormGroup, ): Observable<any> {
    return forkJoin({
        emailReservationClient: this.sendProceedContactClient(data),
        emailReservationPousada: this.sendProceedContactPousada(data)
    })
    .pipe(
      catchError(error => {
        return throwError({code: error.status, message: error.message});
      })
    );
  }

  private sendProceedContactClient(data: FormGroup, ): Observable<any> {
    let clientEmailData: IEmail = {
      fromName: 'Pousada Müller',
      fromEmail: 'contato@hotelmulller.com.br',
      replyTo: data.value.input_reservation_mail,
      toName: data.value.input_reservation_name,
      toEmail: data.value.input_reservation_mail,
      subejct: 'Pousada Müller - Solicitação de Reserva',
      content: ''
    };

    const htmlEmailClient = `<p>Olá <span style="font-weight:bold">${clientEmailData.toName}</span></p>
    <p>Obrigado por entrar em contato conosco! </p>
    <p><span style="font-weight:bold">Não é necessário responder esse email</span>. Nós iremos verificar a disponibilidade de unidades para o período informado e entraremos em contato o quanto antes.</p>
    <p>Você já conhece a nossa <a href="http://www.facebook.com.br/hotelmuller" target="_blank">fã page no facebook</a> ou nosso <a href="https://plus.google.com/+HotelMüllerRioClaro" target="_blank">perfil no google+</a> ? Curtá lá e fique sabendo na hora das novidades, das promoções e dos pacotes para os feriados.</p>
    <p>Atenciosamente,<br>Hotel Müller</p>
    <br>
    <p><a href="https://www.hotelmuller.com.br" target="_blank">https://www.hotelmuller.com.br</a><br>
    <a href="http://www.facebook.com.br/hotelmuller" target="_blank">http://www.facebook.com.br/hotemuller</a></p>`;

    clientEmailData = {...clientEmailData, content: htmlEmailClient};

    return this.sendEmail(clientEmailData);
  }

  private sendProceedContactPousada(data: FormGroup, ): Observable<any> {
    let pousadaDataEmail: IEmail = {
      fromName: data.value.input_reservation_name,
      fromEmail: data.value.input_reservation_mail,
      replyTo: data.value.input_reservation_mail,
      toName: 'Pousada Müller',
      toEmail: 'contato@hotelmuller.com.br',
      subejct: `Site - Reserva - ${data.value.input_reservation_name}`,
      content: ''
    };

    const htmlEmailPousada = `<p><strong>Remetente:</strong> ${pousadaDataEmail.fromName}<[${pousadaDataEmail.fromEmail}]></p>
    <p><strong>Telefone:</strong> ${data.value.input_reservation_phone}</p>
    <p><strong>Q.Unidades:</strong> ${data.value.input_reservation_qunits}</p>
    <p><strong>Q.Pessoas:</strong> ${data.value.input_reservation_qpeoples}</p>
    <p><strong>Q.Crianças:</strong> ${data.value.input_reservation_qchildren}</p>
    <p><strong>D. Entrada:</strong> ${data.value.input_reservation_period1}</p>
    <p><strong>D. Saída:</strong> ${data.value.input_reservation_period2}</p>`;

    pousadaDataEmail = {...pousadaDataEmail, content: htmlEmailPousada};

    return this.sendEmail(pousadaDataEmail);
  }


}