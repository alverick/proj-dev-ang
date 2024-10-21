import { delay, graphql, http, HttpResponse } from 'msw';

import {
  type ProcessStatus,
  processStatus,
} from '../app/shared/constants/process';
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
    HttpResponse.json({ success: true }),
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
    }),
  ),
  http.post(serverApi('/debt/load/:service'), () =>
    HttpResponse.json({ id: 738 }),
  ),
  http.get(serverApi('/debt/process/:process/status'), async function* () {
    let counter = 1;
    await delay();
    const { saving, validating, validated, completed, created } = processStatus;
    let status: ProcessStatus = created;
    const getProcess = (counter: number) => {
      const processSteps: ProcessStatus[] = [
        created,
        validating,
        validated,
        saving,
        completed,
      ];
      const selectedKey = Math.floor(counter / 5);
      return processSteps[selectedKey];
    };
    while (status !== completed) {
      counter++;
      status = getProcess(counter);

      yield HttpResponse.json({
        status,
        errors: [],
        rowsUploaded: -4,
        rowsRejected: 2,
        advance: 100,
        phase: 3,
      });
    }
    return HttpResponse.json({
      status: completed,
      errors: [],
      rowsUploaded: -4,
      rowsRejected: 2,
      advance: 0,
      phase: 3,
    });
  }),
  http.get(serverApi('/Company/GTP/client/353/process?start=0&limit=50'), () =>
    HttpResponse.json({
      total: 11,
      items: [
        {
          id: 733,
          date: '2024-10-17T15:12:26.9033333',
          filename: 'Plantilla de carga - Deuda ADOBE1_20241017-151226.xlsx',
          status: 'SAVING',
          rows: 0,
          service: 'Deuda ANG',
        },
        {
          id: 708,
          date: '2024-09-04T15:49:06.1066667',
          filename: 'Plantilla de carga - Deuda DC_20240904-154906.xlsx',
          status: 'FAILED',
          rows: 5000,
          service: 'Deuda ANG',
        },
        {
          id: 692,
          date: '2024-09-04T00:07:09.1966667',
          filename: 'Plantilla de carga - Deuda DC_20240904-000709.xlsx',
          status: 'FAILED',
          rows: 5000,
          service: 'Deuda ANG',
        },
        {
          id: 668,
          date: '2024-09-03T22:19:29.05',
          filename: 'Plantilla de carga - Deuda DC_20240903-221928.xlsx',
          status: 'FAILED',
          rows: 5000,
          service: 'Deuda ANG',
        },
        {
          id: 638,
          date: '2024-09-02T22:28:50.5733333',
          filename: 'Plantilla de carga - Deuda DC_20240902-222850.xlsx',
          status: 'COMPLETED',
          rows: 5000,
          service: 'Deuda ANG',
        },
        {
          id: 616,
          date: '2024-09-02T21:16:33.4466667',
          filename: 'Plantilla de carga - Deuda DC_20240902-211633.xlsx',
          status: 'COMPLETED',
          rows: 5000,
          service: 'Deuda ANG',
        },
        {
          id: 583,
          date: '2024-08-29T23:47:40.95',
          filename: 'Plantilla de carga - Deuda DC_20240829-234740.xlsx',
          status: 'FAILED',
          rows: 0,
          service: 'Deuda ANG',
        },
        {
          id: 558,
          date: '2024-08-29T22:09:26.38',
          filename: 'Plantilla de carga - Deuda DC_20240829-220926.xlsx',
          status: 'COMPLETED',
          rows: 5000,
          service: 'Deuda ANG',
        },
        {
          id: 541,
          date: '2024-08-29T21:49:18.52',
          filename: 'Plantilla de carga - Deuda DC_20240829-214918.xlsx',
          status: 'COMPLETED',
          rows: 5000,
          service: 'Deuda ANG',
        },
        {
          id: 526,
          date: '2024-08-29T21:20:52.4466667',
          filename: 'Plantilla de carga - Deuda DC_20240829-212052.xlsx',
          status: 'COMPLETED',
          rows: 1000,
          service: 'Deuda ANG',
        },
        {
          id: 511,
          date: '2024-08-29T21:07:43.5766667',
          filename: 'Plantilla de carga - Deuda DC_20240829-210743.xlsx',
          status: 'COMPLETED',
          rows: 1000,
          service: 'Deuda ANG',
        },
      ],
    }),
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
