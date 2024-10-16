import { delay, graphql, http, HttpResponse } from 'msw';

import { environment } from '../environments/environment';

const serverApi = (path: string) => {
  return new URL(`${environment.END_POINT}${path}`).toString();
};

export const handlers = [
  http.post(serverApi('/company/validate'), async () => {
    await delay(5000);
    return HttpResponse.json({
      id: 3000,
      success: true,
      code: 1,
      message: 'El Ruc ya se encuentra registrado',
      tradeName: 'Nombre empresa trade',
      fullName: 'Nombre empresa full',
    });
  }),
  http.post(serverApi('/debt/service/Mensualidad3/debtor'), () =>
    HttpResponse.json({ success: true })
  ),
  http.get(serverApi('/company/GTP/emailgtp'), async () => {
    await delay(5000);
    return HttpResponse.json({
      emails: [{ correo: 'emailgtp@gmail.com' }],
    });
  }),
  http.get(serverApi('/debt/process/last1'), () =>
    HttpResponse.json({
      id: 325,
      status: 'VALIDATING',
      phase: 2,
      advance: 0.0,
    })
  ),
  http.get(serverApi('/debt/process/325/status1'), () =>
    HttpResponse.json({
      status: 'VALIDATING',
      errors: [],
      rowsUploaded: -4,
      rowsRejected: 2,
      advance: 0,
      phase: 3,
    })
  ),
  graphql.query('ListMovies', () => {
    return HttpResponse.json({
      data: {
        movies: [
          {
            title: 'The Lord of The Rings',
          },
          {
            title: 'The Matrix',
          },
          {
            title: 'Star Wars: The Empire Strikes Back',
          },
        ],
      },
    });
  }),
];
