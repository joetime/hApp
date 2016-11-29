
import { Injectable } from '@angular/core';
import { Backand } from './backand.service';
//import { PavingItemModel } from '../models/paving-item.model';

@Injectable()
export class WalgreensProjectService {

    constructor(private BK: Backand) { }

    public Save(item: any): Promise<any> {
        console.log('PavingItemService Save()', item);

        return new Promise((resolve, reject) => {

            //item = this.packItem(item);
            console.log('after packItem', item);

            // if it's a new item
            if (item.id == undefined || item.id <= 0) {
                return this.BK.addWalgreensProject(item).subscribe((res) => {
                    //res = this.unPackItem(res);
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }
            // update 
            else {
                return this.BK.updateWalgreensProject(item).subscribe((res) => {
                    //res = this.unPackItem(res);                    
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }
        });
    }

    public Get() {
        return new Promise((resolve, reject) => {
            this.BK.getWalgreensProjects().subscribe((res) => {
                console.log('getWalgreensProjects Get success', res);
                resolve(res.data);
            }, (err) => {
                reject(err);
            })
        })
    }
    /*
    https://maps.googleapis.com/maps/api/staticmap?size=400x600&key=AIzaSyBjS2gPMkLwIK6o6CyW3d0syamWkf5sdgw&path=color:0xffff00ff|weight:5|39.28876416944479,-76.58092707395548|39.288589012269426,-76.5811389684676|39.28838894331538,-76.58112555742258|39.28833133580626,-76.58122479915613|39.288174601622735,-76.5811657905578|39.28791406919052,-76.58120736479754|39.28774280232263,-76.58101826906193|39.28764938385452,-76.58065617084503|39.28743763486545,-76.58072859048849|39.28713869402617,-76.58067226409912|39.28713454206108,-76.58051133155823|39.287263252864264,-76.58035039901733|39.28806250013726,-76.58031821250916|39.28818913328365,-76.58043622970581|39.28832718391188,-76.58040404319769|39.28841541161442,-76.58033967018133|39.28863338546194,-76.58040404319763&path=color:0xffff00ff|weight:5|39.287394039405825,-76.56326740980148|39.287408571228724,-76.5630555152893|39.28707330054748,-76.56303271651268|39.28704631274483,-76.56323924660683&path=color:0xffff00ff|weight:5|39.287399229342924,-76.56267464160919|39.287050464715136,-76.56265318393707|39.287000641055116,-76.56306624412537|39.286950817359624,-76.56306490302086|39.28696638726827,-76.56268402934074|39.28700479302814,-76.5625847876072|39.2871096302654,-76.5625512599945|39.287277784714284,-76.56257003545761|39.28741479915187,-76.56257539987564&path=color:0xffff00ff|weight:5|39.287534167572204,-76.56328484416008|39.28762862417799,-76.5633076429367|39.287629662161955,-76.56318560242653|39.28768571327356,-76.563181579113|39.28770232100173,-76.56296566128731|39.28765872570693,-76.56295761466026|39.28765872570691,-76.56292542815208|39.287699207052995,-76.56291469931602|39.28770854889877,-76.5627846121788|39.287712700829815,-76.56266927719116|39.287657687723375,-76.56266927719116|39.28764730788711,-76.56260892748833|39.287597484651684,-76.56259819865227|39.28757672495981,-76.56265050172806|39.287554927276695,-76.56259953975677
    */
    public GetZones(id) {
        return new Promise((resolve, reject) => {
            this.BK.getWalgreensProjectZones(id).subscribe((res) => {
                console.log('getWalgreensProjectZones Get success', res);
                for (let z of res.data) {
                    z.pathParsed = JSON.parse(z.path);
                }
                resolve(res.data);
            }, (err) => {
                reject(err);
            })
        })
    }
}