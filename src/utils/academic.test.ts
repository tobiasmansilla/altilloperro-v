import test from 'node:test';
import assert from 'node:assert/strict';
import { filterAndSortDocuments, calculateQuizResult, formatDocumentTypeLabel } from './academic';
import { AcademicDocument } from '../types/academic';

const sampleDocs: AcademicDocument[] = [
  {
    id: 'doc-1',
    title: 'Resumen Sociedad y Estado: Estado, Régimen y Gobierno',
    subjectId: 'icse',
    subjectName: 'Sociedad y Estado (ICSE)',
    career: 'CBC (Ciclo Básico Común)',
    university: 'UBA',
    type: 'resumen',
    catedra: 'Cátedra Pedrosa',
    year: 2024,
    cuatrimestre: '1C',
    author: 'Facu_CBC',
    verified: true,
    rating: 4.9,
    likesCount: 320,
    readTimeMinutes: 10,
    summary: 'Diferencias clave entre Estado, Régimen y Gobierno. Golpe vs Interrupción.',
    tags: ['CBC', 'Resumen', 'UBA XXI'],
    sections: [
      {
        id: 's1',
        title: 'Definición de Estado según Oszlak',
        paragraphs: ['El Estado nacional surge tras un proceso de dominación social y territorial.'],
      },
    ],
    createdAt: '2024-04-10',
  },
  {
    id: 'doc-2',
    title: '1er Parcial Resuelto Análisis Matemático I - Stewart',
    subjectId: 'analisis-1',
    subjectName: 'Análisis Matemático I',
    career: 'Ingeniería',
    university: 'UTN',
    type: 'primer_parcial',
    catedra: 'Cátedra Stewart',
    year: 2023,
    cuatrimestre: '2C',
    author: 'NicoUTN',
    verified: true,
    rating: 4.8,
    likesCount: 512,
    readTimeMinutes: 25,
    summary: 'Límites, asíntotas, derivadas por regla de la cadena y estudio de funciones.',
    tags: ['Parcial', 'Resuelto', 'Límites'],
    sections: [],
    createdAt: '2023-10-15',
  },
];

test('filters documents by career and query', () => {
  const result = filterAndSortDocuments(sampleDocs, {
    career: 'CBC (Ciclo Básico Común)',
    query: 'Oszlak',
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'doc-1');
});

test('filters documents by university and document type', () => {
  const result = filterAndSortDocuments(sampleDocs, {
    university: 'UTN',
    type: 'primer_parcial',
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'doc-2');
});

test('calculateQuizResult correctly evaluates a passing and promotion score', () => {
  const questions = [
    {
      number: 1,
      options: [
        { id: 'a', isCorrect: true },
        { id: 'b', isCorrect: false },
      ],
    },
    {
      number: 2,
      options: [
        { id: 'c', isCorrect: true },
        { id: 'd', isCorrect: false },
      ],
    },
  ];

  // 100% correct
  const result100 = calculateQuizResult({ 1: 'a', 2: 'c' }, questions);
  assert.equal(result100.correctAnswers, 2);
  assert.equal(result100.status, 'Promocionado');
  assert.ok(result100.gradeTenScale >= 7);

  // 50% correct
  const result50 = calculateQuizResult({ 1: 'a', 2: 'd' }, questions);
  assert.equal(result50.correctAnswers, 1);
  assert.equal(result50.status, 'Aprobado a Final');
  assert.equal(result50.gradeTenScale, 4);

  // 0% correct
  const result0 = calculateQuizResult({ 1: 'b', 2: 'd' }, questions);
  assert.equal(result0.correctAnswers, 0);
  assert.equal(result0.status, 'Desaprobado');
});

test('formatDocumentTypeLabel outputs human friendly names', () => {
  assert.equal(formatDocumentTypeLabel('resumen'), 'Resumen Completo');
  assert.equal(formatDocumentTypeLabel('primer_parcial'), '1er Parcial Resuelto');
  assert.equal(formatDocumentTypeLabel('final'), 'Examen Final');
});

test('Hector Brain retrieves accurate academic foundations with citations', async () => {
  const { findFoundationsForDoc } = await import('./hectorBrain');
  const foundations = findFoundationsForDoc(sampleDocs[0]);
  assert.equal(foundations.primaryAuthor, 'Dr. Oscar Oszlak');
  assert.ok(foundations.sourceWork.includes('La formación del Estado Argentino'));
  assert.ok(foundations.keyTakeaway.includes('Oszlak'));
});

test('Hector Brain oral exam evaluation grades responses correctly', async () => {
  const { gradeOralAnswer } = await import('./hectorBrain');
  const exam = {
    questionNumber: 1,
    question: 'Explique Oszlak y estatidad.',
    evaluatorPersona: 'Tribunal',
    requiredConcepts: ['externalización', 'violencia', 'burocracia', 'identidad']
  };

  const goodAnswer = 'Para que haya Estado según Oszlak se necesita externalización del poder, monopolio legítimo de la violencia, aparato de burocracia y recaudación fiscal, e internalización de una identidad nacional común.';
  const evalGood = gradeOralAnswer(exam, goodAnswer);
  assert.ok(evalGood.grade >= 7);
  assert.ok(evalGood.verdict.includes('Aprobado'));

  const poorAnswer = 'Es cuando gobiernan bien.';
  const evalPoor = gradeOralAnswer(exam, poorAnswer);
  assert.ok(evalPoor.grade < 4);
  assert.equal(evalPoor.verdict, 'Insuficiente / Reprobado');
});

