export const Status = {
  INIT: 'init',
  ACCEPTED: 'accepted',
  DOCUMENTS_REQUEST: 'documents_request',
  REJECTED_BY_COUNT: 'rejected_by_count',
  CANCELED: 'canceled',
  REJECTED_BY_MISSING_DOCUMENTS: 'rejected_by_missing_documents',
  INVITATION_TO_ENTRANCE_EXAMINATION: 'invitation_to_entrance_examination',
  MISSING_ON_EXAMINATIONS: 'missing_on_examination',
  APPROVED_BY_EXAMINATIONS: 'approved_by_examinations',
  REJECTED_BY_EXAMINATIONS: 'rejected_by_examinstions',
  DUPLICATE: 'duplicate',
  INVITATION_TO_CLASS: 'invitation_to_class',
  COMPLETED: 'completed',
}

export const StatusColor = {
  INIT: '#A1D5E5',
  ACCEPTED: '#E5DEA1',
  CANCELED: '#51607A',
  REJECTED_BY_COUNT: '#E5A1A1',
  APPROVED_BY_EXAMINATIONS: '#ABE5A1',
  REJECTED_BY_EXAMINATIONS: '#E5A1A1',
  REJECTED_BY_MISSING_DOCUMENTS: '#E5A1A1',
  MISSING_ON_EXAMINATIONS: '#F2BF72',
  DUPLICATE: '#CCD4DF',
  DOCUMENTS_REQUEST: '#AFA1E5',
  INVITATION_TO_ENTRANCE_EXAMINATION: '#E5A1D2',
  INVITATION_TO_CLASS: '#ABE5A1',
  COMPLETED: '#ADB6C7',
}

export const StatusBtnColor = {
  ACCEPTED: '#DBD06E',
  DOCUMENTS_REQUEST: '#7045C6',
  REJECTED_BY_COUNT: '#960000',
  CANCELED: '#817070',
  REJECTED_BY_MISSING_DOCUMENTS: '#960000',
  INVITATION_TO_ENTRANCE_EXAMINATION: '#CD32A2',
  MISSING_ON_EXAMINATIONS: '#C87E0F',
  APPROVED_BY_EXAMINATIONS: '#38A326',
  REJECTED_BY_EXAMINATIONS: '#960000',
  COMPLETED: '#51607A',
}

export const StatusBtnText = {
  ACCEPTED: 'Принята',
  DOCUMENTS_REQUEST: 'Запрос документов',
  REJECTED_BY_COUNT: 'Отклонена (гр. укомплектована)',
  CANCELED: 'Аннулировано',
  REJECTED_BY_MISSING_DOCUMENTS: 'Отклонена (отсутствуют док.)',
  INVITATION_TO_ENTRANCE_EXAMINATION: 'Приглашение на в/и',
  MISSING_ON_EXAMINATIONS: 'Неявка на в/и',
  APPROVED_BY_EXAMINATIONS: 'Одобрена (по итогам в/и)',
  REJECTED_BY_EXAMINATIONS: 'Отклонена (по итогам в/и)',
  COMPLETED: 'Отработана',
}
