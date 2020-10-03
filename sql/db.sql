-- First Version DB OLTP
CREATE DATABASE [Mantencion]
USE [Mantencion]
GO
/****** Object:  UserDefinedFunction [dbo].[f_CallMTBF]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create function [dbo].[f_CallMTBF] (@date Date)
  returns float
  begin
	Declare @MTBF float
	Declare @MTBFAnterior float
	--Declare @MesAnterior varchar(2)
	Declare @fechaAnterior date
	Declare @HorasMes int

	set @fechaAnterior = (select CONVERT(date, DATEADD(MONTH, -1, @date)))

	set @HorasMes=(select datediff(day, dateadd(day, 1-day(@date), @date),
                 dateadd(month, 1, dateadd(day, 1-day(@date), @date))) * 24)

	set @MTBF = isnull(dbo.f_MTBF(@date), dbo.f_MTBF(@fechaAnterior) + @HorasMes )

   return @MTBF
  end;
GO
/****** Object:  UserDefinedFunction [dbo].[f_CallMTBME]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create function [dbo].[f_CallMTBME] (@date Date)
  returns float
  begin
	Declare @MTBME float
	Declare @MTBFMEAnterior float
	Declare @fechaAnterior date
	Declare @HorasMes int

	set @fechaAnterior = (select CONVERT(date, DATEADD(MONTH, -1, @date)))

	set @HorasMes=(select datediff(day, dateadd(day, 1-day(@date), @date),
                 dateadd(month, 1, dateadd(day, 1-day(@date), @date))) * 24)

	set @MTBME = isnull(dbo.f_MTBME(@date), dbo.f_MTBME(@fechaAnterior) + @HorasMes )

   return @MTBME
  end;
GO
/****** Object:  UserDefinedFunction [dbo].[f_Disponibilidad]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[f_Disponibilidad] (@date Date)
  returns float
  begin
	Declare @detencionTotal float
	Declare @disponibilidad float
	Declare @HorasMes int
	Declare @Mes varchar(2)
	set @Mes = (select MONTH(@date))
	set @detencionTotal = (select SUM(Horas_no_programadas+Horas_programadas) from Mantencion.dbo.Mantencion 
		where MONTH(Fecha_mantencion)= @Mes
		and YEAR(Fecha_mantencion)=YEAR(@date))
	
	set @HorasMes=(select datediff(day, dateadd(day, 1-day(@date), @date),
                 dateadd(month, 1, dateadd(day, 1-day(@date), @date))) * 24)

	set @disponibilidad = ISNULL(ROUND(100 * (1-@detencionTotal/@HorasMes),2),0)

   return @disponibilidad
  end;
GO
/****** Object:  UserDefinedFunction [dbo].[f_MTBF]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[f_MTBF] (@date Date)
  returns float
  begin
	Declare @MTBF float
	Declare @HorasMes int
	Declare @Mes varchar(2)
	Declare @HorasProgramadas float
	Declare @HorasNoProgramadas float
	Declare @EventosNoProgramados int
	Declare @CantEvEspecial int
	Declare @Divisor int
	Declare @Dividendo float

	set @Mes = (select MONTH(@date))
		
	set @HorasMes=(select datediff(day, dateadd(day, 1-day(@date), @date),
                 dateadd(month, 1, dateadd(day, 1-day(@date), @date))) * 24)

	set @HorasProgramadas = (select sum(Horas_programadas) 
		from Mantencion.dbo.Mantencion
		where  MONTH(Fecha_mantencion)= @Mes
		and YEAR(Fecha_mantencion)=YEAR(@date) and CantEvento_especial=0)

	set @HorasNoProgramadas= (select sum(Horas_no_programadas) 
		from Mantencion.dbo.Mantencion
		where  MONTH(Fecha_mantencion)= @Mes
		and YEAR(Fecha_mantencion)=YEAR(@date) and CantEvento_especial=0)

	set @EventosNoProgramados = (select SUM(Cantidad_evNoProgramados) from Mantencion.dbo.Mantencion 	
		where MONTH(Fecha_mantencion)= @Mes
		and YEAR(Fecha_mantencion)=YEAR(@date))

	set @CantEvEspecial =(select SUM(CantEvento_especial) from Mantencion.dbo.Mantencion 	
		where MONTH(Fecha_mantencion)= @Mes
		and YEAR(Fecha_mantencion)=YEAR(@date))

	set @Dividendo = (@HorasMes-@HorasNoProgramadas-@HorasProgramadas)
	set @Divisor = (@EventosNoProgramados-@CantEvEspecial)

	set @MTBF = ROUND(@Dividendo/@Divisor,2)

   return @MTBF
  end;
GO
/****** Object:  UserDefinedFunction [dbo].[f_MTBME]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[f_MTBME] (@date Date)
  returns float
  begin
	Declare @MTBME float
	Declare @HorasMes int
	Declare @Mes varchar(2)
	Declare @HorasProgramadas float
	Declare @HorasNoProgramadas float
	Declare @EventosNoProgramados int
	Declare @EventosProgramados int
	Declare @CantEvEspecial int
	Declare @Divisor int
	Declare @Dividendo float

	set @Mes = (select MONTH(@date))
		
	set @HorasMes=(select datediff(day, dateadd(day, 1-day(@date), @date),
                 dateadd(month, 1, dateadd(day, 1-day(@date), @date))) * 24)

	set @HorasProgramadas = (select sum(Horas_programadas) 
		from Mantencion.dbo.Mantencion
		where  MONTH(Fecha_mantencion)= @Mes
		and YEAR(Fecha_mantencion)=YEAR(@date) and CantEvento_especial=0)

	set @HorasNoProgramadas= (select sum(Horas_no_programadas) 
		from Mantencion.dbo.Mantencion
		where  MONTH(Fecha_mantencion)= @Mes
		and YEAR(Fecha_mantencion)=YEAR(@date) and CantEvento_especial=0)

	set @EventosNoProgramados = (select SUM(Cantidad_evNoProgramados) from Mantencion.dbo.Mantencion 	
		where MONTH(Fecha_mantencion)= @Mes
		and YEAR(Fecha_mantencion)=YEAR(@date))

	set @EventosProgramados = (select SUM(Cantidad_evProgramados) from Mantencion.dbo.Mantencion 	
		where MONTH(Fecha_mantencion)= @Mes
		and YEAR(Fecha_mantencion)=YEAR(@date))

	set @CantEvEspecial =(select SUM(CantEvento_especial) from Mantencion.dbo.Mantencion 	
		where MONTH(Fecha_mantencion)= @Mes
		and YEAR(Fecha_mantencion)=YEAR(@date))

	set @Dividendo = (@HorasMes-@HorasNoProgramadas-@HorasProgramadas)
	set @Divisor = (@EventosNoProgramados + @EventosProgramados - @CantEvEspecial)

	set @MTBME = ROUND(@Dividendo/@Divisor,2)

   return @MTBME
  end;
GO
/****** Object:  UserDefinedFunction [dbo].[f_MTTR]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 CREATE function [dbo].[f_MTTR] (@date Date)
  returns float
  begin
	Declare @EventosNoProgramados int
	Declare @MTTR float
	Declare @HorasNoProgramadas float
	Declare @Mes varchar(2)
	set @Mes = (select MONTH(@date))

	set @HorasNoProgramadas = (select SUM(Horas_no_programadas) from Mantencion.dbo.Mantencion 	
		where MONTH(Fecha_mantencion)= @Mes
		and YEAR(Fecha_mantencion)=YEAR(@date))
	set @EventosNoProgramados = (select SUM(Cantidad_evNoProgramados) from Mantencion.dbo.Mantencion 	
		where MONTH(Fecha_mantencion)= @Mes
		and YEAR(Fecha_mantencion)=YEAR(@date))

	set @MTTR = ISNULL(ROUND(@HorasNoProgramadas/@EventosNoProgramados, 2),0)

   return @MTTR
  end;
GO
/****** Object:  Table [dbo].[Area_Productiva]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Area_Productiva](
	[Id_area] [int] IDENTITY(1,1) NOT NULL,
	[Nombre_area] [varchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Categoria]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categoria](
	[Id_categoria] [int] IDENTITY(1,1) NOT NULL,
	[Nombre_categoria] [varchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Componente]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Componente](
	[Id_componente] [int] IDENTITY(1,1) NOT NULL,
	[Denominacion] [varchar](50) NOT NULL,
	[Id_maquinaria] [int] NOT NULL,
	[Estado] [bit] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Evento]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Evento](
	[Id_evento] [int] IDENTITY(1,1) NOT NULL,
	[Nombre_evento] [varchar](80) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Falla]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Falla](
	[Id_falla] [int] IDENTITY(1,1) NOT NULL,
	[Id_categoria] [int] NOT NULL,
	[Descripcion_causa] [varchar](255) NOT NULL,
	[Id_tipo] [int] NOT NULL,
	[Falla] [bit] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Falla_Componente]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Falla_Componente](
	[Id_componente] [int] NOT NULL,
	[Id_falla] [int] NOT NULL,
	[Id_fallaComponente] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [XPKFalla_Componente] PRIMARY KEY CLUSTERED 
(
	[Id_fallaComponente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Falla_Mantencion]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Falla_Mantencion](
	[Id_falla] [int] NOT NULL,
	[Id_mantencion] [int] NOT NULL,
	[Id_FallaMantencion] [int] IDENTITY(1,1) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[KPI]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[KPI](
	[Id_kpi] [int] IDENTITY(1,1) NOT NULL,
	[Nombre_kpi] [varchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Login]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Login](
	[Contraseña] [varchar](20) NOT NULL,
	[Rut] [varchar](12) NOT NULL,
	[Id_rol] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Mantencion]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Mantencion](
	[Id_componente] [int] NOT NULL,
	[Id_mantencion] [int] IDENTITY(1,1) NOT NULL,
	[Fecha_mantencion] [datetime] NOT NULL,
	[CantEvento_especial] [int] NULL,
	[Duracion] [float] NULL,
	[Descripcion] [varchar](255) NULL,
	[Horas_programadas] [float] NULL,
	[Horas_no_programadas] [float] NULL,
	[Cantidad_evProgramados] [int] NULL,
	[Cantidad_evNoProgramados] [int] NULL,
	[RCFA] [int] NULL,
	[Area] [varchar](50) NULL,
	[Id_evento] [int] NOT NULL,
	[Id_tipo] [int] NULL,
	[OT] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Maquinaria]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Maquinaria](
	[Id_maquinaria] [int] IDENTITY(1,1) NOT NULL,
	[Nombre_maquinaria] [varchar](150) NOT NULL,
	[Estado] [bit] NOT NULL,
	[Id_area] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Programa_Mantencion]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Programa_Mantencion](
	[Id_ProgramaMantencion] [int] IDENTITY(1,1) NOT NULL,
	[Año] [int] NOT NULL,
	[Meta] [float] NOT NULL,
	[Id_maquinaria] [int] NOT NULL,
	[Id_kpi] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ReporteKPI]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReporteKPI](
	[Id_reportekpi] [int] IDENTITY(1,1) NOT NULL,
	[Fecha] [datetime] NOT NULL,
	[Resultado_kpi] [float] NOT NULL,
	[Mes] [varchar](20) NOT NULL,
	[Id_maquinaria] [int] NOT NULL,
	[Id_kpi] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rol]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rol](
	[Id_rol] [int] IDENTITY(1,1) NOT NULL,
	[Nombre_rol] [varchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tipo_falla]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tipo_falla](
	[Id_tipo] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tipo_mantencion]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tipo_mantencion](
	[Nombre] [varchar](50) NOT NULL,
	[Id_tipo] [int] IDENTITY(1,1) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuario]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuario](
	[Nombre] [varchar](100) NOT NULL,
	[Apellidos] [varchar](100) NOT NULL,
	[Rut] [varchar](12) NOT NULL,
	[Correo_electronico] [varchar](60) NOT NULL,
	[Estado] [bit] NOT NULL,
	[Cargo] [varchar](50) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuario_AreaProductiva]    Script Date: 02-07-2020 0:58:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuario_AreaProductiva](
	[Rut] [varchar](12) NOT NULL,
	[Id_usuarioArea] [int] IDENTITY(1,1) NOT NULL,
	[Id_area] [int] NOT NULL
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Area_Productiva] ON 

INSERT [dbo].[Area_Productiva] ([Id_area], [Nombre_area]) VALUES (1, N'Chancador Primario')
INSERT [dbo].[Area_Productiva] ([Id_area], [Nombre_area]) VALUES (2, N'Pebbles')
INSERT [dbo].[Area_Productiva] ([Id_area], [Nombre_area]) VALUES (3, N'Fase 5')
INSERT [dbo].[Area_Productiva] ([Id_area], [Nombre_area]) VALUES (4, N'Molienda')
INSERT [dbo].[Area_Productiva] ([Id_area], [Nombre_area]) VALUES (5, N'Flotación')
INSERT [dbo].[Area_Productiva] ([Id_area], [Nombre_area]) VALUES (6, N'Relave')
INSERT [dbo].[Area_Productiva] ([Id_area], [Nombre_area]) VALUES (7, N'Eléctrico y Instrumentista')
SET IDENTITY_INSERT [dbo].[Area_Productiva] OFF
SET IDENTITY_INSERT [dbo].[Categoria] ON 

INSERT [dbo].[Categoria] ([Id_categoria], [Nombre_categoria]) VALUES (1, N'Categoría 1')
INSERT [dbo].[Categoria] ([Id_categoria], [Nombre_categoria]) VALUES (2, N'Categoría 2')
SET IDENTITY_INSERT [dbo].[Categoria] OFF
SET IDENTITY_INSERT [dbo].[Componente] ON 

INSERT [dbo].[Componente] ([Id_componente], [Denominacion], [Id_maquinaria], [Estado]) VALUES (1, N'31CR01', 1, 1)
INSERT [dbo].[Componente] ([Id_componente], [Denominacion], [Id_maquinaria], [Estado]) VALUES (2, N'32CV02', 1, 1)
INSERT [dbo].[Componente] ([Id_componente], [Denominacion], [Id_maquinaria], [Estado]) VALUES (3, N'31FE016', 1, 1)
INSERT [dbo].[Componente] ([Id_componente], [Denominacion], [Id_maquinaria], [Estado]) VALUES (4, N'Picaroca', 1, 1)
SET IDENTITY_INSERT [dbo].[Componente] OFF
SET IDENTITY_INSERT [dbo].[Evento] ON 

INSERT [dbo].[Evento] ([Id_evento], [Nombre_evento]) VALUES (1, N'Mantención programada')
INSERT [dbo].[Evento] ([Id_evento], [Nombre_evento]) VALUES (2, N'Mantención no programada')
SET IDENTITY_INSERT [dbo].[Evento] OFF
SET IDENTITY_INSERT [dbo].[Falla] ON 

INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (1, 1, N'Reparación corte cinta CV02', 3, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (2, 1, N'Sistema de Diluvio CV02', 2, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (3, 1, N'Soltura manto superior', 1, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (4, 1, N'Cambio de Poste', 1, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (5, 1, N'Falla Picaroca', 2, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (6, 1, N'Reparación controlador Eléctrico', 4, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (7, 1, N'Reparación protección CV02', 4, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (8, 1, N'Desalineamiento FE016', 2, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (9, 1, N'Cambio relé FE016', 4, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (10, 1, N'Cambio de Polin CV02', 4, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (11, 1, N'Sistema de Lubricación', 2, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (12, 1, N'Cambio de Polin FE016', 4, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (13, 1, N'Escanner Correa CV02', 1, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (14, 1, N'Cambio pernos CV02', 4, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (15, 1, N'Vulcanizado FE016', 4, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (16, 1, N'Belt rip mecánico CV02', 4, 1)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (17, 1, N'Mantención Cámara', 4, 0)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (18, 1, N'Cambio de revestimientos', 4, 0)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (19, 1, N'Cambio de concavas', 4, 0)
INSERT [dbo].[Falla] ([Id_falla], [Id_categoria], [Descripcion_causa], [Id_tipo], [Falla]) VALUES (20, 1, N'Cambio Main Shaft', 4, 0)
SET IDENTITY_INSERT [dbo].[Falla] OFF
SET IDENTITY_INSERT [dbo].[Falla_Componente] ON 

INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 1)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 15, 2)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 17, 3)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (4, 5, 4)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 4, 5)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 4, 6)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 11, 7)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 8)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (4, 5, 9)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 14, 10)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (4, 5, 11)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 11, 12)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 17, 13)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 12, 14)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 17, 15)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 8, 16)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 11, 17)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 8, 18)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 4, 19)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 4, 20)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 8, 21)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 7, 22)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 10, 23)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 1, 24)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 1, 25)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 3, 26)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 1, 27)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 8, 28)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 18, 29)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 18, 30)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 18, 31)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 18, 32)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 1, 33)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 1, 34)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 1, 35)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 8, 36)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 37)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 38)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 8, 39)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 8, 40)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 8, 41)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 7, 42)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 8, 43)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 8, 44)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 4, 45)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 4, 46)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 4, 47)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 4, 48)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 4, 49)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 50)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 7, 51)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 52)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 53)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 4, 54)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 4, 55)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 2, 56)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 17, 57)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 17, 58)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 11, 59)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 10, 60)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 61)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 62)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 13, 63)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 64)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 65)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 66)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 10, 67)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (4, 5, 68)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 16, 69)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 9, 70)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 9, 71)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 9, 72)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 19, 73)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 19, 74)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 19, 75)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 19, 76)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 6, 77)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 6, 78)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (3, 12, 79)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 80)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 81)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 20, 82)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (1, 20, 83)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 10, 84)
INSERT [dbo].[Falla_Componente] ([Id_componente], [Id_falla], [Id_fallaComponente]) VALUES (2, 2, 85)
SET IDENTITY_INSERT [dbo].[Falla_Componente] OFF
SET IDENTITY_INSERT [dbo].[Falla_Mantencion] ON 

INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 1, 1)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (15, 2, 2)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (17, 3, 3)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (5, 4, 4)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (4, 5, 5)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (4, 6, 6)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (11, 7, 7)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 8, 8)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (5, 9, 9)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (14, 10, 10)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (5, 11, 11)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (11, 12, 12)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (17, 13, 13)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (12, 14, 14)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (17, 15, 15)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (8, 16, 16)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (11, 17, 17)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (8, 18, 18)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (4, 19, 19)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (4, 20, 20)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (8, 21, 21)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (7, 22, 22)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (10, 23, 23)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (1, 24, 24)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (1, 25, 25)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (3, 26, 26)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (1, 27, 27)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (8, 28, 28)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (18, 29, 29)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (18, 30, 30)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (18, 31, 31)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (18, 32, 32)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (1, 33, 33)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (1, 34, 34)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (1, 35, 35)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (8, 36, 36)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 37, 37)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 38, 38)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (8, 39, 39)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (8, 40, 40)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (8, 41, 41)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (7, 42, 42)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (8, 43, 43)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (8, 44, 44)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (4, 45, 45)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (4, 46, 46)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (4, 47, 47)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (4, 48, 48)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (4, 49, 49)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 50, 50)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (7, 51, 51)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 52, 52)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 53, 53)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (4, 54, 54)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (4, 55, 55)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 56, 56)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (17, 57, 57)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (17, 58, 58)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (11, 59, 59)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (10, 60, 60)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 61, 61)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 62, 62)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (13, 63, 63)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 64, 64)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 65, 65)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 66, 66)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (10, 67, 67)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (5, 68, 68)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (16, 69, 69)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (9, 70, 70)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (9, 71, 71)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (9, 72, 72)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (19, 73, 73)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (19, 74, 74)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (19, 75, 75)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (19, 76, 76)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (6, 77, 77)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (6, 78, 78)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (12, 79, 79)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 80, 80)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 81, 81)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (20, 82, 82)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (20, 83, 83)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (10, 84, 84)
INSERT [dbo].[Falla_Mantencion] ([Id_falla], [Id_mantencion], [Id_FallaMantencion]) VALUES (2, 85, 85)
SET IDENTITY_INSERT [dbo].[Falla_Mantencion] OFF
SET IDENTITY_INSERT [dbo].[KPI] ON 

INSERT [dbo].[KPI] ([Id_kpi], [Nombre_kpi]) VALUES (1, N'Disponiblidad')
INSERT [dbo].[KPI] ([Id_kpi], [Nombre_kpi]) VALUES (2, N'MTTR')
INSERT [dbo].[KPI] ([Id_kpi], [Nombre_kpi]) VALUES (3, N'MTBF')
INSERT [dbo].[KPI] ([Id_kpi], [Nombre_kpi]) VALUES (4, N'MTBME')
SET IDENTITY_INSERT [dbo].[KPI] OFF
SET IDENTITY_INSERT [dbo].[Mantencion] ON 

INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 1, CAST(N'2019-01-12T00:00:00.000' AS DateTime), 1, 1, N'Reparacion cables red de incendio', 0, 1.77, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 2, CAST(N'2019-01-14T00:00:00.000' AS DateTime), 0, 0, N'15:10-15:30 Hrs. Mantención mecánica repara FE-16, el cual tenia una rotura considerable, por donde cayendo a piso. 15:30-16:08 Hrs. FE-16 no sale en servicio, problema', 0, 0.98, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 3, CAST(N'2019-01-16T00:00:00.000' AS DateTime), 0, 8, N'Mantención Programada: Mantencion de camara', 8.25, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (4, 4, CAST(N'2019-01-19T00:00:00.000' AS DateTime), 0, 1, N'traslado de picaroca n°2 desde tolva a area de mantención', 0, 1.38, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 5, CAST(N'2019-01-22T00:00:00.000' AS DateTime), 0, 9, N'Mantención Programada', 9.67, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 6, CAST(N'2019-01-23T00:00:00.000' AS DateTime), 0, 11, N'Mantención Programada', 11.83, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 7, CAST(N'2019-01-23T00:00:00.000' AS DateTime), 0, 0, N'Filtros saturados', 0, 0.25, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 8, CAST(N'2019-01-27T00:00:00.000' AS DateTime), 1, 0, N'Reparacion red incendio', 0, 0.62, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (4, 9, CAST(N'2019-01-27T00:00:00.000' AS DateTime), 0, 0, N'posicionamiento valvula direccional de picarrocas 2', 0, 0.23, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 10, CAST(N'2019-02-08T00:00:00.000' AS DateTime), 0, 1, N'Se detiene CV02 para inspeccion de pernos del tambor de la polea de cola, encontrandose 3 cortado lado mina.', 0, 1.1, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (4, 11, CAST(N'2019-02-13T00:00:00.000' AS DateTime), 0, 0, N'caen bombas de mov. picarrocas al momento de estar desatollando', 0, 0.5, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 12, CAST(N'2019-02-13T00:00:00.000' AS DateTime), 0, 0, N'Bajo nivel de flujo del sistema', 0, 0.18, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 13, CAST(N'2019-02-14T00:00:00.000' AS DateTime), 0, 9, N'Mantención Programada', 9, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 14, CAST(N'2019-02-18T00:00:00.000' AS DateTime), 0, 1, N'Cambio de polín', 0, 1.6, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 15, CAST(N'2019-03-05T00:00:00.000' AS DateTime), 0, 8, N'Mantención Programada', 8.7, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 16, CAST(N'2019-03-06T00:00:00.000' AS DateTime), 0, 0, N'alineamiento feeder 16', 0, 0.37, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 17, CAST(N'2019-03-23T00:00:00.000' AS DateTime), 0, 0, N'Cambio de Filtros y cambio de manga', 0, 0.07, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 18, CAST(N'2019-03-31T00:00:00.000' AS DateTime), 0, 0, N'alineamiento feeder 16', 0, 0.42, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 19, CAST(N'2019-04-02T00:00:00.000' AS DateTime), 0, 12, N'Mantención Programada', 12, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 20, CAST(N'2019-04-03T00:00:00.000' AS DateTime), 0, 23, N'Mantención Programada', 23.9, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 21, CAST(N'2019-04-06T00:00:00.000' AS DateTime), 0, 0, N'Alineamiento feeder 16', 0, 0.7, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 22, CAST(N'2019-04-13T00:00:00.000' AS DateTime), 0, 0, N'Guardera Fuera de Posición', 0, 0.92, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 23, CAST(N'2019-04-30T00:00:00.000' AS DateTime), 0, 1, N'Cambio de Polines de Retorno', 0, 1, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 24, CAST(N'2019-05-02T00:00:00.000' AS DateTime), 0, 6, N'Reparacion de cinta CV02 .', 0, 6.5, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 25, CAST(N'2019-05-03T00:00:00.000' AS DateTime), 0, 24, N'Reparacion de cinta CV02 .', 0, 24, 0, 0, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 26, CAST(N'2019-05-07T00:00:00.000' AS DateTime), 0, 9, N'se suelta tuerca superior del manto y parte inferior de este', 0, 9, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 27, CAST(N'2019-05-10T00:00:00.000' AS DateTime), 0, 2, N'Inspeccion cinta cv002', 0, 2.02, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 28, CAST(N'2019-05-15T00:00:00.000' AS DateTime), 0, 0, N'Alineamiento de feeder 16', 0, 0.18, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 29, CAST(N'2019-05-21T00:00:00.000' AS DateTime), 0, 16, N'Mantención Programada', 16.78, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 30, CAST(N'2019-05-22T00:00:00.000' AS DateTime), 0, 24, N'Mantención Programada', 24, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 31, CAST(N'2019-05-23T00:00:00.000' AS DateTime), 0, 24, N'Mantención Programada', 24, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 32, CAST(N'2019-05-24T00:00:00.000' AS DateTime), 0, 5, N'Mantención Programada', 5.72, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 33, CAST(N'2019-05-30T00:00:00.000' AS DateTime), 0, 0, N'F/S CV02 para cambio de polines, cambio de gualderas, cambio pastillas de freno y retiro de goma en polea motriz', 0, 0.82, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 34, CAST(N'2019-05-30T00:00:00.000' AS DateTime), 0, 0, N'Reparación CV02', 0, 0.98, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 35, CAST(N'2019-05-31T00:00:00.000' AS DateTime), 0, 18, N'Reparación CV02', 0, 18.07, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 36, CAST(N'2019-06-08T00:00:00.000' AS DateTime), 0, 0, N'Cinta FE16 se desalinea, se solicita Mecanico .', 0, 0.58, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 37, CAST(N'2019-06-14T00:00:00.000' AS DateTime), 1, 3, N'reposicion de cablres de red de incendio cortados por malla de fortificacion', 0, 3.88, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 38, CAST(N'2019-06-16T00:00:00.000' AS DateTime), 1, 1, N'Reparación cable sistema red de incendio.', 0, 1.93, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 39, CAST(N'2019-06-19T00:00:00.000' AS DateTime), 0, 0, N'Cinta FE16 se desalinea, se solicita Mecanico .', 0, 0.38, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 40, CAST(N'2019-06-22T00:00:00.000' AS DateTime), 0, 0, N'Cinta FE16 se desalinea, se solicita Mecanico .', 0, 0.15, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 41, CAST(N'2019-06-25T00:00:00.000' AS DateTime), 0, 0, N'Cinta FE16 se desalinea, se solicita Mecanico .', 0, 0.37, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 42, CAST(N'2019-06-29T00:00:00.000' AS DateTime), 0, 2, N'reparacion de gualderas en cv002', 0, 2.32, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 43, CAST(N'2019-07-04T00:00:00.000' AS DateTime), 0, 0, N'Cinta FE16 se desalinea, se solicita Mecanico .', 0, 0.45, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 44, CAST(N'2019-07-06T00:00:00.000' AS DateTime), 0, 0, N'Cinta FE16 se desalinea, se solicita Mecanico .', 0, 0.17, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 45, CAST(N'2019-07-09T00:00:00.000' AS DateTime), 0, 11, N'Mantención Programada Cambio de Poste', 11.95, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 46, CAST(N'2019-07-10T00:00:00.000' AS DateTime), 0, 24, N'Mantención Programada Cambio de Poste', 24, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 47, CAST(N'2019-07-11T00:00:00.000' AS DateTime), 0, 24, N'Mantención Programada Cambio de Poste', 24, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 48, CAST(N'2019-07-12T00:00:00.000' AS DateTime), 0, 24, N'Mantención Programada Cambio de Poste', 24, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 49, CAST(N'2019-07-13T00:00:00.000' AS DateTime), 0, 0, N'Mantención Programada Cambio de Poste', 0.72, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 50, CAST(N'2019-07-23T00:00:00.000' AS DateTime), 1, 1, N'reparacion cables sistema de diluvio CV-02', 0, 1.12, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 51, CAST(N'2019-08-03T00:00:00.000' AS DateTime), 0, 0, N'Problema de retorno ,falla electrica no entra en servicio CV-02', 0, 0.78, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 52, CAST(N'2019-08-09T00:00:00.000' AS DateTime), 1, 1, N'reparacion cable de red de incendio CV-02,sistema de diluvio', 0, 1.88, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 53, CAST(N'2019-08-11T00:00:00.000' AS DateTime), 1, 0, N'reparacion cables red de incendio', 0, 0.73, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 54, CAST(N'2019-08-20T00:00:00.000' AS DateTime), 0, 3, N'cambio poste por soltura tuerca', 0, 3.42, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 55, CAST(N'2019-08-21T00:00:00.000' AS DateTime), 0, 4, N'cambio poste por soltura tuerca', 0, 4.92, 0, 0, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 56, CAST(N'2019-08-25T00:00:00.000' AS DateTime), 0, 1, N'falla electrica,problema de retorno', 0, 1.12, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 57, CAST(N'2019-09-03T00:00:00.000' AS DateTime), 0, 12, N'Mantención Programada: mantencion camara', 12, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 58, CAST(N'2019-09-04T00:00:00.000' AS DateTime), 0, 2, N'Mantención Programada: mantencion camara', 2.7, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 59, CAST(N'2019-09-08T00:00:00.000' AS DateTime), 0, 2, N'Cambio de manguera en sistema de lubricacion del reductor motor A', 0, 2.22, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 60, CAST(N'2019-09-16T00:00:00.000' AS DateTime), 0, 0, N'Cambio polin de carga.', 0, 0.88, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 61, CAST(N'2019-09-22T00:00:00.000' AS DateTime), 1, 0, N'Reparacion de cable cortado red de incendio .', 0, 0.85, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 62, CAST(N'2019-09-24T00:00:00.000' AS DateTime), 1, 0, N'cambian cable red de incendio CV 02', 0, 0.87, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 63, CAST(N'2019-09-24T00:00:00.000' AS DateTime), 0, 2, N'scanner correa ', 0, 2.15, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 64, CAST(N'2019-09-26T00:00:00.000' AS DateTime), 1, 1, N'reparacion cables de red de incendio', 0, 1.58, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 65, CAST(N'2019-09-29T00:00:00.000' AS DateTime), 1, 0, N'F/S CV02 para reponer 20 metros de cable dañado en zona 2 sistema de diluvio', 0, 0.63, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 66, CAST(N'2019-10-04T00:00:00.000' AS DateTime), 1, 1, N'Reposición del sistema de diluvio, Zona 1 cortado por un alambre.', 0, 1.13, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 67, CAST(N'2019-10-07T00:00:00.000' AS DateTime), 0, 1, N'corte de cable por vibracion en polea de cabeza', 0, 1.22, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (4, 68, CAST(N'2019-10-08T00:00:00.000' AS DateTime), 0, 3, N'instalación de pica rocas 1', 0, 3.01, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 69, CAST(N'2019-10-10T00:00:00.000' AS DateTime), 0, 0, N'Belt rip mecánico', 0, 0.35, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 70, CAST(N'2019-10-10T00:00:00.000' AS DateTime), 0, 0, N'Queda solucionado el problema eléctrico de retorno del FE-16, cambian un rele los eléctricos', 0, 0.37, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 71, CAST(N'2019-10-11T00:00:00.000' AS DateTime), 0, 2, N'Queda solucionado el problema eléctrico de retorno del FE-16, cambian un rele los eléctricos', 0, 2.63, 0, 0, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 72, CAST(N'2019-10-12T00:00:00.000' AS DateTime), 0, 0, N'Queda solucionado el problema eléctrico de retorno del FE-16, cambian un rele los eléctricos', 0, 0.47, 0, 0, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 73, CAST(N'2019-10-15T00:00:00.000' AS DateTime), 0, 24, N'Mantención Programada', 24, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 74, CAST(N'2019-10-16T00:00:00.000' AS DateTime), 0, 24, N'Mantención Programada', 24, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 75, CAST(N'2019-10-17T00:00:00.000' AS DateTime), 0, 24, N'Mantención Programada', 24, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 76, CAST(N'2019-10-18T00:00:00.000' AS DateTime), 0, 10, N'Mantención Programada', 10.8, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 77, CAST(N'2019-10-18T00:00:00.000' AS DateTime), 0, 0, N'Personal electrico realizando pruebas de activación de paradas de emergencia del chancador, se percata que una no activa detención del equipo', 0, 0.77, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 78, CAST(N'2019-10-19T00:00:00.000' AS DateTime), 0, 3, N'Personal electrico realizando pruebas de activación de paradas de emergencia del chancador, se percata que una no activa detención del equipo', 0, 3.4, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (3, 79, CAST(N'2019-10-30T00:00:00.000' AS DateTime), 0, 0, N'Cambio de 6 polines de carga en el FE-16', 0, 0.85, 0, 1, 0, N'Chancador Primario', 2, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 80, CAST(N'2019-10-31T00:00:00.000' AS DateTime), 1, 0, N'F/S CV02 para reparar zona 1 dañada del sistema de diluvio, se cambio tramo', 0, 0.93, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 81, CAST(N'2019-11-21T00:00:00.000' AS DateTime), 1, 1, N'Reposición del sistema de diluvio CV-02', 0, 1, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 82, CAST(N'2019-12-04T00:00:00.000' AS DateTime), 0, 12, N'Mantención Programada cambio de main shaft', 12, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (1, 83, CAST(N'2019-12-05T00:00:00.000' AS DateTime), 0, 7, N'Mantención Programada', 7.75, 0, 1, 0, 0, N'Chancador Primario', 1, 1, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 84, CAST(N'2019-12-18T00:00:00.000' AS DateTime), 0, 1, N'15:08 a 16:55 limpieza sector terrestre CV02, Resiter 16:55 a 18:21 cambio de polines 93 y 95 CV02 personal mecánico', 0, 1.45, 0, 1, 0, N'Chancador Primario', 2, 4, NULL)
INSERT [dbo].[Mantencion] ([Id_componente], [Id_mantencion], [Fecha_mantencion], [CantEvento_especial], [Duracion], [Descripcion], [Horas_programadas], [Horas_no_programadas], [Cantidad_evProgramados], [Cantidad_evNoProgramados], [RCFA], [Area], [Id_evento], [Id_tipo], [OT]) VALUES (2, 85, CAST(N'2019-12-24T00:00:00.000' AS DateTime), 1, 7, N'Alarma de diluvio, ocasionada por una malla de fortificación', 0, 7.6, 0, 1, 0, N'Chancador Primario', 2, 2, NULL)
SET IDENTITY_INSERT [dbo].[Mantencion] OFF
SET IDENTITY_INSERT [dbo].[Maquinaria] ON 

INSERT [dbo].[Maquinaria] ([Id_maquinaria], [Nombre_maquinaria], [Estado], [Id_area]) VALUES (1, N'Chancador Primario', 1, 1)
SET IDENTITY_INSERT [dbo].[Maquinaria] OFF
SET IDENTITY_INSERT [dbo].[Tipo_falla] ON 

INSERT [dbo].[Tipo_falla] ([Id_tipo], [Nombre]) VALUES (1, N'Falla Aguda')
INSERT [dbo].[Tipo_falla] ([Id_tipo], [Nombre]) VALUES (2, N' Falla Crónica')
INSERT [dbo].[Tipo_falla] ([Id_tipo], [Nombre]) VALUES (3, N'Falla Crónica y Aguda')
INSERT [dbo].[Tipo_falla] ([Id_tipo], [Nombre]) VALUES (4, N'Sin clasificar')
SET IDENTITY_INSERT [dbo].[Tipo_falla] OFF
SET IDENTITY_INSERT [dbo].[Tipo_mantencion] ON 

INSERT [dbo].[Tipo_mantencion] ([Nombre], [Id_tipo]) VALUES (N'Mecánica', 1)
INSERT [dbo].[Tipo_mantencion] ([Nombre], [Id_tipo]) VALUES (N'Elétrica', 2)
INSERT [dbo].[Tipo_mantencion] ([Nombre], [Id_tipo]) VALUES (N'Instrumentista', 3)
INSERT [dbo].[Tipo_mantencion] ([Nombre], [Id_tipo]) VALUES (N'Ninguna', 4)
SET IDENTITY_INSERT [dbo].[Tipo_mantencion] OFF
/****** Object:  Index [XPKArea_Productiva]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Area_Productiva] ADD  CONSTRAINT [XPKArea_Productiva] PRIMARY KEY NONCLUSTERED 
(
	[Id_area] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKCategoria]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Categoria] ADD  CONSTRAINT [XPKCategoria] PRIMARY KEY NONCLUSTERED 
(
	[Id_categoria] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKComponente]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Componente] ADD  CONSTRAINT [XPKComponente] PRIMARY KEY NONCLUSTERED 
(
	[Id_componente] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKEvento]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Evento] ADD  CONSTRAINT [XPKEvento] PRIMARY KEY NONCLUSTERED 
(
	[Id_evento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKCausa_detencion]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Falla] ADD  CONSTRAINT [XPKCausa_detencion] PRIMARY KEY NONCLUSTERED 
(
	[Id_falla] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKDetalle_Detencion]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Falla_Mantencion] ADD  CONSTRAINT [XPKDetalle_Detencion] PRIMARY KEY NONCLUSTERED 
(
	[Id_FallaMantencion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKKPI]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[KPI] ADD  CONSTRAINT [XPKKPI] PRIMARY KEY NONCLUSTERED 
(
	[Id_kpi] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [XPKLogin]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Login] ADD  CONSTRAINT [XPKLogin] PRIMARY KEY NONCLUSTERED 
(
	[Rut] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKMantencion]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Mantencion] ADD  CONSTRAINT [XPKMantencion] PRIMARY KEY NONCLUSTERED 
(
	[Id_mantencion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKMaquinaria]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Maquinaria] ADD  CONSTRAINT [XPKMaquinaria] PRIMARY KEY NONCLUSTERED 
(
	[Id_maquinaria] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKPrograma_Mantencion]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Programa_Mantencion] ADD  CONSTRAINT [XPKPrograma_Mantencion] PRIMARY KEY NONCLUSTERED 
(
	[Id_ProgramaMantencion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKReporteKPI]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[ReporteKPI] ADD  CONSTRAINT [XPKReporteKPI] PRIMARY KEY NONCLUSTERED 
(
	[Id_reportekpi] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKRol]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Rol] ADD  CONSTRAINT [XPKRol] PRIMARY KEY NONCLUSTERED 
(
	[Id_rol] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKTipo_falla]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Tipo_falla] ADD  CONSTRAINT [XPKTipo_falla] PRIMARY KEY NONCLUSTERED 
(
	[Id_tipo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKTipo_mantencion]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Tipo_mantencion] ADD  CONSTRAINT [XPKTipo_mantencion] PRIMARY KEY NONCLUSTERED 
(
	[Id_tipo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [XPKUsuario]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Usuario] ADD  CONSTRAINT [XPKUsuario] PRIMARY KEY NONCLUSTERED 
(
	[Rut] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [XPKUsuario_AreaProductiva]    Script Date: 02-07-2020 0:58:56 ******/
ALTER TABLE [dbo].[Usuario_AreaProductiva] ADD  CONSTRAINT [XPKUsuario_AreaProductiva] PRIMARY KEY NONCLUSTERED 
(
	[Id_usuarioArea] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Mantencion] ADD  DEFAULT ((0)) FOR [CantEvento_especial]
GO
ALTER TABLE [dbo].[Mantencion] ADD  CONSTRAINT [DF_Mantencion_Duracion]  DEFAULT ((0)) FOR [Duracion]
GO
ALTER TABLE [dbo].[Mantencion] ADD  DEFAULT ((0)) FOR [Horas_programadas]
GO
ALTER TABLE [dbo].[Mantencion] ADD  DEFAULT ((0)) FOR [Horas_no_programadas]
GO
ALTER TABLE [dbo].[Mantencion] ADD  DEFAULT ((0)) FOR [Cantidad_evProgramados]
GO
ALTER TABLE [dbo].[Mantencion] ADD  DEFAULT ((0)) FOR [Cantidad_evNoProgramados]
GO
ALTER TABLE [dbo].[Mantencion] ADD  DEFAULT ((0)) FOR [RCFA]
GO
ALTER TABLE [dbo].[Componente]  WITH CHECK ADD  CONSTRAINT [R_16] FOREIGN KEY([Id_maquinaria])
REFERENCES [dbo].[Maquinaria] ([Id_maquinaria])
GO
ALTER TABLE [dbo].[Componente] CHECK CONSTRAINT [R_16]
GO
ALTER TABLE [dbo].[Falla]  WITH CHECK ADD  CONSTRAINT [R_28] FOREIGN KEY([Id_categoria])
REFERENCES [dbo].[Categoria] ([Id_categoria])
GO
ALTER TABLE [dbo].[Falla] CHECK CONSTRAINT [R_28]
GO
ALTER TABLE [dbo].[Falla]  WITH CHECK ADD  CONSTRAINT [R_41] FOREIGN KEY([Id_tipo])
REFERENCES [dbo].[Tipo_falla] ([Id_tipo])
GO
ALTER TABLE [dbo].[Falla] CHECK CONSTRAINT [R_41]
GO
ALTER TABLE [dbo].[Falla_Componente]  WITH CHECK ADD  CONSTRAINT [R_79] FOREIGN KEY([Id_componente])
REFERENCES [dbo].[Componente] ([Id_componente])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Falla_Componente] CHECK CONSTRAINT [R_79]
GO
ALTER TABLE [dbo].[Falla_Componente]  WITH CHECK ADD  CONSTRAINT [R_81] FOREIGN KEY([Id_falla])
REFERENCES [dbo].[Falla] ([Id_falla])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Falla_Componente] CHECK CONSTRAINT [R_81]
GO
ALTER TABLE [dbo].[Falla_Mantencion]  WITH CHECK ADD  CONSTRAINT [R_35] FOREIGN KEY([Id_falla])
REFERENCES [dbo].[Falla] ([Id_falla])
GO
ALTER TABLE [dbo].[Falla_Mantencion] CHECK CONSTRAINT [R_35]
GO
ALTER TABLE [dbo].[Falla_Mantencion]  WITH CHECK ADD  CONSTRAINT [R_37] FOREIGN KEY([Id_mantencion])
REFERENCES [dbo].[Mantencion] ([Id_mantencion])
GO
ALTER TABLE [dbo].[Falla_Mantencion] CHECK CONSTRAINT [R_37]
GO
ALTER TABLE [dbo].[Login]  WITH CHECK ADD  CONSTRAINT [R_20] FOREIGN KEY([Rut])
REFERENCES [dbo].[Usuario] ([Rut])
GO
ALTER TABLE [dbo].[Login] CHECK CONSTRAINT [R_20]
GO
ALTER TABLE [dbo].[Login]  WITH CHECK ADD  CONSTRAINT [R_25] FOREIGN KEY([Id_rol])
REFERENCES [dbo].[Rol] ([Id_rol])
GO
ALTER TABLE [dbo].[Login] CHECK CONSTRAINT [R_25]
GO
ALTER TABLE [dbo].[Mantencion]  WITH CHECK ADD  CONSTRAINT [R_27] FOREIGN KEY([Id_evento])
REFERENCES [dbo].[Evento] ([Id_evento])
GO
ALTER TABLE [dbo].[Mantencion] CHECK CONSTRAINT [R_27]
GO
ALTER TABLE [dbo].[Mantencion]  WITH CHECK ADD  CONSTRAINT [R_40] FOREIGN KEY([Id_tipo])
REFERENCES [dbo].[Tipo_mantencion] ([Id_tipo])
GO
ALTER TABLE [dbo].[Mantencion] CHECK CONSTRAINT [R_40]
GO
ALTER TABLE [dbo].[Mantencion]  WITH CHECK ADD  CONSTRAINT [R_6] FOREIGN KEY([Id_componente])
REFERENCES [dbo].[Componente] ([Id_componente])
GO
ALTER TABLE [dbo].[Mantencion] CHECK CONSTRAINT [R_6]
GO
ALTER TABLE [dbo].[Maquinaria]  WITH CHECK ADD  CONSTRAINT [R_67] FOREIGN KEY([Id_area])
REFERENCES [dbo].[Area_Productiva] ([Id_area])
GO
ALTER TABLE [dbo].[Maquinaria] CHECK CONSTRAINT [R_67]
GO
ALTER TABLE [dbo].[Programa_Mantencion]  WITH CHECK ADD  CONSTRAINT [R_65] FOREIGN KEY([Id_maquinaria])
REFERENCES [dbo].[Maquinaria] ([Id_maquinaria])
GO
ALTER TABLE [dbo].[Programa_Mantencion] CHECK CONSTRAINT [R_65]
GO
ALTER TABLE [dbo].[Programa_Mantencion]  WITH CHECK ADD  CONSTRAINT [R_66] FOREIGN KEY([Id_kpi])
REFERENCES [dbo].[KPI] ([Id_kpi])
GO
ALTER TABLE [dbo].[Programa_Mantencion] CHECK CONSTRAINT [R_66]
GO
ALTER TABLE [dbo].[ReporteKPI]  WITH CHECK ADD  CONSTRAINT [R_52] FOREIGN KEY([Id_maquinaria])
REFERENCES [dbo].[Maquinaria] ([Id_maquinaria])
GO
ALTER TABLE [dbo].[ReporteKPI] CHECK CONSTRAINT [R_52]
GO
ALTER TABLE [dbo].[ReporteKPI]  WITH CHECK ADD  CONSTRAINT [R_53] FOREIGN KEY([Id_kpi])
REFERENCES [dbo].[KPI] ([Id_kpi])
GO
ALTER TABLE [dbo].[ReporteKPI] CHECK CONSTRAINT [R_53]
GO
ALTER TABLE [dbo].[Usuario_AreaProductiva]  WITH CHECK ADD  CONSTRAINT [R_43] FOREIGN KEY([Rut])
REFERENCES [dbo].[Usuario] ([Rut])
GO
ALTER TABLE [dbo].[Usuario_AreaProductiva] CHECK CONSTRAINT [R_43]
GO
ALTER TABLE [dbo].[Usuario_AreaProductiva]  WITH CHECK ADD  CONSTRAINT [R_68] FOREIGN KEY([Id_area])
REFERENCES [dbo].[Area_Productiva] ([Id_area])
GO
ALTER TABLE [dbo].[Usuario_AreaProductiva] CHECK CONSTRAINT [R_68]
GO
