export type RequestBody = {
  date: string,
  time: string,
  trigger: string,
  emotionGroup: string,
  emotions: string,
  thoughts: string,
  behavior: string,
  weight?: string
}

export type RowData = RequestBody & {
  id: string
}

export type ResponseData = {
  data?: RowData[];
  errors?: {
    code: number;
    message: string;
  }[];
}

export type Fields = keyof RequestBody;
