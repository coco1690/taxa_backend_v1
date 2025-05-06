

// ✅ 1. ¿Cuándo usar handleDbQuery()?
// Solo cuando haces una consulta pura:

// find()

// findOne()

// count()

// queryBuilder.getMany() o getOne()

// ✅ 2. ¿Cuándo usar handleDbSave()?

// Operación	Método
// Guardar	    handleDbSave()
// Actualizar	handleDbSave()
// Eliminar	handleDbSave()


import {
    BadRequestException,
    InternalServerErrorException,
  } from '@nestjs/common';
  
  /**
   * Ejecuta y guarda datos en base de datos con manejo de errores.
   * @param promise - Promesa del repositorio (ej. repository.save())
   */
  export async function handleDbSave<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException(error.detail);
      }
      console.error(error);
      throw new InternalServerErrorException('Error inesperado al guardar en la base de datos.');
    }
  }
  
  /**
   * Ejecuta una consulta en base de datos con manejo de errores.
   * @param promise - Promesa del repositorio (ej. repository.find(), findOne())
   */
  export async function handleDbQuery<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error: any) {
      console.error(error);
      throw new InternalServerErrorException('Error inesperado al consultar la base de datos.');
    }
  }
  